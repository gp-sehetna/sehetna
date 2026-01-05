import torch
import joblib
import pickle
import logging

from ...config import Settings

logger = logging.getLogger(__name__)

class ModelLoader:
    def __init__(self):
        self.model: torch.nn.Module = None
        self.pipeline = None
        self.y_scaler = None
        self.feature_names = None
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        
        logger.info(f"Using device: {self.device}")
        
    def __call__(self, settings: Settings):
        try:
            self.load_model(settings.MODEL_PATH)
            self.load_pipeline(settings.PIPELINE_PATH)
            self.load_y_scaler(settings.Y_SCALER_PATH)
            self.load_feature_names(settings.FEATURE_NAMES_PATH)
            
            logger.info("All artifacts loaded successfully")
        except Exception as e:
            logger.error(f"Error loading artifacts: {e}")
        
    # Load model
    def load_model(self, path: str):
        with open(path, 'rb') as file:
            self.model = pickle.load(file).to(self.device).eval()
        
        logger.info(f"Loaded model from {path}")

    def load_y_scaler(self, path: str):
        self.y_scaler = joblib.load(path)
        
        logger.info(f"Loaded y_scaler from {path}")
        
    def load_pipeline(self, path: str):
        self.pipeline = joblib.load(path)
        
        logger.info(f"Loaded pipeline from {path}")

    def load_feature_names(self, path: str):
        self.feature_names = joblib.load(path)
        
        logger.info(f"Loaded feature names from {path}")

# Global instance
model_loader = ModelLoader()