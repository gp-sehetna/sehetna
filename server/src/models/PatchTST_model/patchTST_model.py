import joblib
import logging
import torch
import torch.nn as nn
import numpy as np
import pandas as pd
from types import SimpleNamespace
from torch.utils.data import DataLoader
from src.models.PatchTST_model.dataset import ClimateHealthDataset
from src.utils.prediction_utils import collapse_overlapping_predictions
from transformers import PatchTSTConfig, PatchTSTForPrediction

logger = logging.getLogger(__name__)
class PatchTSTModel:
    
    def __init__(self, model_path: str, pipeline_path: str, y_scaler_path: str, countries_ids: dict[str, int] ,device: str = None ):
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
        self.countries_ids = countries_ids


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

    def predict(self, df: pd.DataFrame, return_uncertainty: bool = True) -> tuple[list[float], list[float] | None]:
        """
        Generate predictions using the ClimateHealthDataset with overlapping window collapse.
        
        Args:
            df: DataFrame with preprocessed climate-health data
                Must contain target columns and date column
            return_uncertainty: If True, compute uncertainty from overlapping predictions
        
        Returns:
            tuple: (predictions, uncertainty)
                - predictions: List of 5 predicted health outcomes
                - uncertainty: List of 5 standard deviations (None if return_uncertainty=False)
        """

    

        try:

            logger.info(f"Generating predictions for dataframe with shape: {df.shape}")
            logger.info(f"Return uncertainty: {return_uncertainty}")
            
            # Create dataset
            dataset = ClimateHealthDataset(
                df=df,
                targets=self.targets,
                countries_ids=self.countries_ids,
                seq_len=self.seq_len,
                horizon_len=self.horizon_len
            )
            
            num_samples = len(dataset)
            logger.info(f"Dataset created with {num_samples} samples")
            
            if num_samples == 0:
                logger.warning("Dataset has no samples, returning zeros")
                return [0.0] * self.num_targets, None
            
            # If only one sample or uncertainty not needed, use simple prediction
            if num_samples == 1 or not return_uncertainty:
                return self._predict_single(dataset)
            
            # Otherwise, use all samples and collapse overlapping predictions
            return self._predict_with_collapse(dataset)
        
        
        except Exception as e:
            logger.error(f"Error during PatchTST prediction: {e}")
            # Return zeros as fallback
            return [0.0] * self.num_targets
        
    def _predict_single(self, dataset) -> tuple[list[float], None]:
        """
        Simple prediction using the last sample only.
        
        Args:
            dataset: ClimateHealthDataset instance
        
        Returns:
            tuple: (predictions, None)
        """
        # Create dataloader (batch_size=1 for inference)
        dataloader = DataLoader(dataset, batch_size=1, shuffle=False)
        
        # Get the last sample (most recent prediction)
        y_past, y_future = next(iter(dataloader))
        y_past = y_past.to(self.device)
        y_future = y_future.to(self.device)
        
        # Run inference
        with torch.no_grad():
            with torch.amp.autocast(self.device):
                outputs = self.model(y_past, y_future)
                preds = outputs.prediction_outputs  # [1, horizon, num_targets]
        
        # Extract predictions: [horizon, num_targets]
        preds_np = preds.cpu().numpy()[0]
        
        # Inverse transform to original scale
        preds_flat = preds_np.reshape(-1, self.num_targets)
        preds_unscaled = self.y_scaler.inverse_transform(preds_flat)
        preds_unscaled = preds_unscaled.reshape(self.horizon_len, self.num_targets)
        
        # Average across horizon to get single prediction per target
        final_predictions = preds_unscaled.mean(axis=0).tolist()
        
        logger.info(f"Generated predictions (single sample): {final_predictions}")
        
        return final_predictions, None
    



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

