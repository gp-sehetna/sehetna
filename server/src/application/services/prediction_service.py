import logging

import pandas as pd

from src.application.services.shap_service import ShapExplanabilityService
from src.core.settings import Settings
from src.domain.schemas.predictions import PredictionQueryParams, PredictionRequest, WeeklyEnvironmentData
from src.infrastructure.data.indicator_repository import IndicatorRepository
from src.infrastructure.ml.model_loader import ModelLoader

logger = logging.getLogger(__name__)


def scale_to_100(value, worst, best):
    if value is None:
        return None
    value = max(min(value, worst), best) if worst > best else max(min(value, best), worst)
    return 100 * (value - worst) / (best - worst)


def resolve_m49_code(country_map: pd.DataFrame, iso3: str) -> int:
    return country_map.loc[country_map["iso3"] == iso3, "m49"].astype(int).iloc[0]


def extract_years(weekly_data: list):
    return pd.to_datetime([w.date for w in weekly_data]).year.unique().tolist()


def filter_annual_indicator(
    df: pd.DataFrame,
    country_col: str,
    country_value,
    year_col: str,
    years: list[int],
):
    return df[(df[country_col] == country_value) & (df[year_col].isin(years))]


def mean_or_default(df: pd.DataFrame, column: str, default: float = 10.0):
    return df[column].mean() if not df.empty else default


def compute_food_security_index(
    food_production_index: float | None,
    undernourishment: float | None,
    affordability_percent: float,
    food_insecurity_percent: float,
):
    availability = scale_to_100(food_production_index, worst=50, best=150) or 0
    utilization = scale_to_100(undernourishment, worst=40, best=0) or 0
    access = scale_to_100(affordability_percent, worst=100, best=0) or 0
    stability = scale_to_100(food_insecurity_percent, worst=60, best=0) or 0

    return 0.35 * stability + 0.25 * utilization + 0.25 * access + 0.15 * availability


def expand_weekly_rows(
    weekly_data: list[WeeklyEnvironmentData],
    country_code: str,
    latitude: float,
    longitude: float,
    indicators: dict,
):
    return pd.DataFrame(
        {
            **week.model_dump(),
            **indicators,
            "country_code": country_code,
            "latitude": latitude,
            "longitude": longitude,
        }
        for week in weekly_data
    )


class PredictionService(ShapExplanabilityService):
    def __init__(self, indicator_repository: IndicatorRepository, model_loader: ModelLoader, settings: Settings):
        super().__init__(settings, model_loader)
        self.indicator_repository = indicator_repository
        self.model_loader = model_loader
        self.settings = settings

    def get_df(self, req: PredictionRequest) -> pd.DataFrame:
        country_map, uhc_df, food_access_df, food_stability_df = self.indicator_repository.get_indicators()

        m49_code = resolve_m49_code(country_map, req.country_code)
        years = extract_years(req.data)

        uhc = filter_annual_indicator(uhc_df, "DIM_GEO_CODE_M49", m49_code, "DIM_TIME", years)
        food_access = filter_annual_indicator(food_access_df, "REF_AREA", req.country_code, "TIME_PERIOD", years)
        food_stability = filter_annual_indicator(food_stability_df, "REF_AREA", req.country_code, "TIME_PERIOD", years)

        healthcare_access_index = mean_or_default(uhc, "INDEX_N")
        affordability_percent = mean_or_default(food_access, "OBS_VALUE")
        food_insecurity_percent = mean_or_default(food_stability, "OBS_VALUE")

        food_security_index = compute_food_security_index(
            req.indicators.food_production_index,
            req.indicators.undernourishment,
            affordability_percent,
            food_insecurity_percent,
        )

        return expand_weekly_rows(
            req.data,
            req.country_code,
            req.lat,
            req.lon,
            indicators={
                "food_security_index": food_security_index,
                "gdp_per_capita_usd": req.indicators.gdp_per_capita_usd,
                "healthcare_access_index": healthcare_access_index,
            },
        )

    def simulate(self, req: PredictionRequest, query: PredictionQueryParams | None = None):
        
        df = self.get_df(req)
        df_processed = self.model_loader.pipeline.transform(df)
        X_test = df_processed[self.settings.features]

        
        explanations = None
        if query is not None : 
            logger.info("Explaining...")
            explanations = self._explain(X_test, query.explainer_method, query.top_k_contributors)

        logger.info("Predicting...")
        predictions: list[list[float]] = self.model_loader.model.predict(X_test)

        return predictions, explanations
