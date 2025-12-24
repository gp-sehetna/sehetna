import torch
import joblib
import pickle
from pathlib import Path
import logging


logger = logging.getLogger(__name__)

class ModelLoader:
    def __init__(self):
        self.model = None
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

    def load_feature_names(self, path: str):
        """Load feature names for proper ordering"""
        try:
            with open(path, 'rb') as f:
                self.feature_names = pickle.load(f)
            logger.info(f"Loaded feature names from {path}")
        except Exception as e:
            logger.error(f"Error loading feature names: {e}")
            raise


    def get_model(self):
        return self.model
    
    def get_pipeline(self):
        return self.pipeline
    
    def get_y_scaler(self):
        return self.y_scaler
    
    def get_feature_names(self):
        return self.feature_names
    
    def get_device(self):
        return self.device
    

# Global instance
model_loader = ModelLoader()