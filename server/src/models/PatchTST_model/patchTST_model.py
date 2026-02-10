import joblib
import logging
import torch
import torch.nn as nn
import numpy as np
from types import SimpleNamespace
from transformers import PatchTSTConfig, PatchTSTForPrediction

logger = logging.getLogger(__name__)
class PatchTSTModel:
    
    def __init__(self, model_path: str, pipeline_path: str, y_scaler_path: str, device: str = None):
        """
        Initialize PatchTST model.
        
        Args:
            model_path: Path to saved model checkpoint (.pkl file)
            pipeline_path: Path to preprocessing pipeline (.joblib file)
            y_scaler_path: Path to target scaler (.joblib file)
            device: Device to run model on ('cuda' or 'cpu')
        """


        self.device = device or ('cuda' if torch.cuda.is_available() else 'cpu')
        logger.info(f"Initializing PatchTST model on device: {self.device}")

         
        # Load preprocessing pipeline and scaler
        self.pipeline = joblib.load(pipeline_path)
        self.y_scaler = joblib.load(y_scaler_path)

        # Model configuration (from your notebook)
        self.seq_len = 12
        self.horizon_len = 6
        self.num_targets = 5  # 5 health outcomes


        # Target names
        self.targets = [
            'respiratory_disease_rate',
            'cardio_mortality_rate', 
            'vector_disease_risk_score',
            'waterborne_disease_incidents',
            'heat_related_admissions'
        ]

        # Initialize model architecture
        config = self._create_model_config()
        self.model = PatchTST(config, self.num_targets)
        
        # Load trained weights
        self._load_checkpoint(model_path)
        
        # Move to device and set to eval mode
        self.model = self.model.to(self.device)
        self.model.eval()
        
        logger.info("PatchTST model initialized successfully")

    def _create_model_config(self):
        """Create model configuration matching training setup."""

        
        return SimpleNamespace(
            d_model=128,
            n_heads=32,
            num_layers=8,
            patch_len=6,
            patch_stride=8,
            dropout=0.11,
            seq_len=self.seq_len,
            prediction_len=self.horizon_len,
        )
        
    
    def _load_checkpoint(self, model_path: str):
        """Load model weights from checkpoint."""
        import pickle
        
        logger.info(f"Loading model checkpoint from: {model_path}")
        
        with open(model_path, 'rb') as f:
            checkpoint = pickle.load(f)
        
        # Extract state dict
        state_dict = checkpoint.get('model_state_dict', checkpoint)
        
        # Load weights
        self.model.load_state_dict(state_dict)
        
        logger.info("Model weights loaded successfully")

    def predict(self, series: list[float], horizon: int = 6) -> list[float]:
        """
        Generate predictions for a given time series.
        
        Args:
            series: List of PM2.5 values (or other time series data)
            horizon: Number of steps to forecast (default: 6)
        
        Returns:
            List of 5 predicted health outcomes (averaged across horizon)
    
        """
    

        try:
            # For now, return the last horizon prediction
            # In a full implementation, you'd preprocess the series properly
            
            if len(series) < self.seq_len:
                logger.warning(f"Series length {len(series)} < seq_len {self.seq_len}, padding with zeros")
                series = [0.0] * (self.seq_len - len(series)) + series

            # Take last seq_len values
            series_input = series[-self.seq_len:]


            y_past = np.array([series_input] * self.num_targets).T
            y_past = torch.from_numpy(y_past).float().unsqueeze(0).to(self.device)


            # Run inference
            with torch.no_grad():
                with torch.amp.autocast(self.device):
                    outputs = self.model(y_past, y_past[:, :horizon, :])  # Dummy future values
                    preds = outputs.prediction_outputs  # [1, horizon, num_targets]


            # Extract predictions: [horizon, num_targets]
            preds_np = preds.cpu().numpy()[0]


            # Inverse transform to original scale
            preds_flat = preds_np.reshape(-1, self.num_targets)
            preds_unscaled = self.y_scaler.inverse_transform(preds_flat)
            preds_unscaled = preds_unscaled.reshape(horizon, self.num_targets)


            # Average across horizon to get single prediction per target
            final_predictions = preds_unscaled.mean(axis=0).tolist()
            
            logger.info(f"Generated predictions: {final_predictions}")
            
            return final_predictions
        
        except Exception as e:
            logger.error(f"Error during PatchTST prediction: {e}")
            # Return zeros as fallback
            return [0.0] * self.num_targets
        


class PatchTST(nn.Module):

    def __init__(self, config, num_targets):
        super().__init__()

        model_config = PatchTSTConfig(
            num_input_channels=num_targets,
            context_length=config.seq_len,
            prediction_length=config.prediction_len,

            d_model=config.d_model,
            num_attention_heads=config.n_heads,
            num_hidden_layers=config.num_layers,

            patch_length=config.patch_len,
            stride=config.patch_stride,
            dropout=config.dropout,

            loss="mse"
        )
    
        self.patchtst_model = PatchTSTForPrediction(model_config)
    
    def forward(self, y_past, y_future):
        outputs = self.patchtst_model(past_values=y_past, future_values=y_future)
        return outputs

