import joblib
import logging
from pathlib import Path 
logger = logging.getLogger(__name__)


class ModelLoader:
    def __init__(self):
        self.model = None
        self.pipeline = None
        self.targets = [
            'respiratory_disease_rate',
            'cardio_mortality_rate',
            'vector_disease_risk_score',
            'waterborne_disease_incidents',
            'heat_related_admissions'
        ]

    def load_model(self, path: str):
        """Load LightGBM MultiOutputRegressor model"""
        try:
            self.model = joblib.load(path)
            logger.info(f"Loaded LightGBM model from {path}")
        except Exception as e:
            logger.error(f"Error loading model: {e}")
            raise


    def load_pipeline(self, path: str):
        """Load preprocessing pipeline"""
        try:
            self.pipeline = joblib.load(path)
            logger.info(f"Loaded pipeline from {path}")
        except Exception as e:
            logger.error(f"Error loading pipeline: {e}")
            raise
    

    def get_model(self):
        return self.model
    
    def get_pipeline(self):
        return self.pipeline
    
    def get_targets(self):
        return self.targets
    


# Global instance
model_loader = ModelLoader()
