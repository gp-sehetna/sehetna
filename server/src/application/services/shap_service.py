import logging
from collections.abc import Hashable
from typing import Any

import pandas as pd
import shap

from config import Settings
from src.domain.types import ExplainerMethod
from src.infrastructure.ml.model_loader import ModelLoader

logger = logging.getLogger(__name__)


class ShapExplanabilityService:
    def __init__(self, settings: Settings, model_loader: ModelLoader):
        self.settings = settings
        self.model_loader = model_loader

    def __explain_further(self, explanation: shap.Explanation, method: str, feature_groups=None, top_k=5) -> pd.DataFrame:
        self.fn = self.__cumulative_contributions if method == "cumulative" else self.__group_shap
        self.top_k = top_k
        self.groups = feature_groups
        self.explanation = explanation
        extended_df = self.fn(*self.__unpack_explanation(self.explanation))
        return extended_df

    def _explain(self, X_test: pd.DataFrame, explainer_method: ExplainerMethod = "cumulative", top_k: int = 5):
        explanations: dict[str, list[dict[Hashable, Any]]] = {}

        for target, estimator in zip(self.settings.targets, self.model_loader.model.estimators_):
            name = target.replace("_", " ").title()
            logger.info(f"Explainer for {name}...")

            explainer = shap.TreeExplainer(
                estimator,
                data=self.model_loader.shap_X_background,
                feature_names=self.settings.features,
                feature_perturbation="interventional",
            )

            explanation = explainer(X_test, check_additivity=False)
            explanations_df = self.__explain_further(explanation, explainer_method, self.settings.feature_groups, top_k)
            explanations[target] = explanations_df.to_dict(orient="records")

        return explanations

    def __shap_percentages(self, explanation_df: pd.DataFrame, col="abs_shap"):
        total = explanation_df[col].sum()
        explanation_df = explanation_df.copy()
        explanation_df["percent"] = explanation_df[col] / total * 100
        return explanation_df.sort_values("percent", ascending=False).reset_index(drop=True)

    def __group_shap(self, explanation_df: pd.DataFrame, _: float):
        if self.groups is None:
            raise ValueError("Feature groups not provided")

        rows = []
        for group, feats in self.groups.items():
            subset = explanation_df[explanation_df.feature.isin(feats)]
            if len(subset) == 0:
                continue

            rows.append({"group": group, "shap_sum": subset.shap.sum(), "abs_shap_sum": subset.abs_shap.sum()})

        return self.__shap_percentages(pd.DataFrame(rows), "abs_shap_sum").head(self.top_k)

    def __cumulative_contributions(self, explanation_df: pd.DataFrame, base_value: float):
        df_sorted = explanation_df.sort_values("abs_shap", ascending=False).head(self.top_k)

        running = base_value
        rows = []

        for _, r in df_sorted.iterrows():
            prev = running
            running += r["shap"]

            direction = "Increase" if r["shap"] > 0 else "Decrease" if r["shap"] < 0 else "Unchanged"
            rows.append({"feature": r["feature"], "shap": r["shap"], "from": prev, "to": running, "direction": direction})

        return pd.DataFrame(rows)

    def __unpack_explanation(self, explanation: shap.Explanation):
        explanation_df = pd.DataFrame(
            {"feature": explanation.feature_names, "value": explanation.data[0], "shap": explanation.values[0]}
        )
        explanation_df["abs_shap"] = explanation_df["shap"].abs()

        return explanation_df, explanation.base_values[0]
