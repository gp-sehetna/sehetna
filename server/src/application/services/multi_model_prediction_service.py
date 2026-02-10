import logging
from domain.schemas.predictions import PredictionRequest , PredictionResult

from infrastructure.ml.model_orchestrator import ModelOrchestrator;
logger = logging.getLogger(__name__)


class MultiModelPredictionService:
    def __init__(self):
        # Initialize the orchestrator
        self.orchestrator = ModelOrchestrator()

    def predict(
        self,
        req : PredictionRequest,
        explainer_method= "cumulative"
    )-> PredictionResult :

        """
        Run predictions from TimesFM + PatchTST and aggregate results.
        """

        # Example: convert weekly data to series (can extend based on your features)
        weekly_series = [d.pm25_ugm3 for d in req.data]


        # Step 2: Run models
        logger.info("Running TimesFM and PatchTST predictions...")
        model_predictions = self.orchestrator.run(series=weekly_series, horizon=len(weekly_series))


        # Step 3: Convert to PredictionResult
        result = PredictionResult.from_multi_model_predictions(
            predictions=model_predictions,
            method=explainer_method,
            explanation_data=None,  # SHAP/feature explanations can be added later
        )

        return result


