import torch
import joblib
import pickle
import logging


logger = logging.getLogger(__name__)

class ModelLoader:
    def __init__(self):
        self.model: torch.nn.Module = None
        self.pipeline = None
        self.y_scaler = None
        self.feature_names = None
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        logger.info(f"Using device: {self.device}")
        
    # Load model
    def load_model(self, path: str):
       
        try:
            with open(path, 'rb') as file:
                self.model = pickle.load(file)
            self.model.to(self.device)
            self.model.eval()
            logger.info(f"Loaded model from {path}")
        except Exception as e:
            logger.error(f"Error loading model: {e}")
            raise

    def load_y_scaler(self, path: str):
        """Load target scaler"""
        try:
            self.y_scaler = joblib.load(path)
            logger.info(f"Loaded y_scaler from {path}")
        except Exception as e:
            logger.error(f"Error loading y_scaler: {e}")
            raise
        
    def load_pipeline(self, path: str):
        """Load preprocessing pipeline"""
        try:
            self.pipeline = joblib.load(path)
            logger.info(f"Loaded pipeline from {path}")
        except Exception as e:
            logger.error(f"Error loading pipeline: {e}")
            raise

    def load_feature_names(self, path: str):
        """Load feature names for proper ordering"""
        try:
            self.feature_names = joblib.load(path)
            logger.info(f"Loaded feature names from {path}")
        except Exception as e:
            logger.error(f"Error loading feature names: {e}")
            raise

# Global instance
model_loader = ModelLoader()