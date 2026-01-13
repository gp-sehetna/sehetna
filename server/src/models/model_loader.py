import joblib
import logging

logger = logging.getLogger(__name__)


class ModelLoader:
    def __init__(self):
        self.model = None
        self.pipeline = None
        self.targets = [
            "respiratory_disease_rate",
            "cardio_mortality_rate",
            "vector_disease_risk_score",
            "waterborne_disease_incidents",
            "heat_related_admissions",
        ]
        
    def __call__(self, settings):
        try:
            self.load_model(settings.model_path)
            logger.info("Model loaded successfully")
        except Exception as e:
            logger.critical("Failed to load model", exc_info=e)
        try:
            self.load_pipeline(settings.pipeline_path)
            logger.info("Pipeline loaded successfully")
        except Exception as e:
            logger.critical("Failed to load Pipeline", exc_info=e)

    def load_model(self, path: str):
        self.model = joblib.load(path)
        logger.info(f"Loaded LightGBM model from {path}")

    def load_pipeline(self, path: str):
        self.pipeline = joblib.load(path)
        logger.info(f"Loaded pipeline from {path}")


# Global instance
model_loader = ModelLoader()
