import logging
from src.domain.schemas.predictions import PredictionRequest , PredictionResult

from src.infrastructure.ml.model_orchestrator import ModelOrchestrator;
logger = logging.getLogger(__name__)


class MultiModelPredictionService:
    def __init__(self , orchestrator : ModelOrchestrator):
        # Initialize the orchestrator
        self.orchestrator = ModelOrchestrator()
        logger.info("MultiModelPredictionService initialized")


    def predict(
        self,
        req : PredictionRequest,
        explainer_method : str= "cumulative" 
    )-> PredictionResult :

        """
        Run predictions from TimesFM + PatchTST and aggregate results.
        """

        logger.info(f"Starting multi-model prediction for country: {req.country_code}")
        logger.info(f"Number of weekly data points: {len(req.data)}")


        weekly_series = [d.pm25_ugm3 for d in req.data]


        horizon = len(weekly_series)

        try:
            model_predictions = self.orchestrator.run(series=weekly_series ,horizon= horizon)
            logger.info("Model predictions completed successfully")
        except Exception as e:
            logger.error(f"Error during model orchestration: {e}")
            raise


        result = PredictionResult.from_multi_model_predections(
            predictions=model_predictions,
            method=explainer_method,
            explanation_data=None # SHAP/feature explanations can be added later
        )

        logger.info(f"Multi-model prediction completed: {result}")


        return result


