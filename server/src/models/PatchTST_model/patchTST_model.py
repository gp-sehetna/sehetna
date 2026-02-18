import logging
import os
import pickle
from pathlib import Path
from types import SimpleNamespace

import joblib
import pandas as pd
import torch
import torch.nn as nn
from transformers import PatchTSTConfig, PatchTSTForPrediction

from src.domain.schemas.predictions import PredictionResult
from src.models.PatchTST_model.dataset import ClimateHealthDataset
from src.models.SequentialModel import SequentialModel
from src.utils.prediction_utils import collapse_overlapping_predictions

# from transformers import PatchTSTConfig, PatchTSTForPrediction

logger = logging.getLogger(__name__)

class PatchTST(nn.Module, SequentialModel):
    
    """
    PatchTST model implementing SequentialModel interface.
    """

    def __init__(self, settings):

        nn.Module.__init__(self)
        SequentialModel.__init__(self, settings)
        
        # Model components (will be loaded)
        self.model = None
        self.target_scaler = None
        self.countries_ids = None
        self.resources_path = os.path.abspath("resources")
        # Model configuration
        self.seq_len = 12
        self.horizon_len = 6
        self.num_targets = 5

        # Device
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

        self.targets = [
            'respiratory_disease_rate',
            'cardio_mortality_rate', 
            'vector_disease_risk_score',
            'waterborne_disease_incidents',
            'heat_related_admissions'
        ]

        # Loaded flag
        logger.info("PatchTST instance created")
    def load(self):
        """
        Load PatchTST model components
        Loads:
        1. Model checkpoint (weights)
        2. Preprocessing pipeline
        3. Target scaler
        4. Country mappings

        Returns:
            str: Status message
        """



        logger.info("Loading PatchTST model components...")

        try:


            patchTST_model_path = self.settings.patchtst_model_path
   
            model_path = Path(patchTST_model_path)
            scaler_path = Path(self.settings.patchtst_scaler_path)








            # Step 1: Load target scaler
            logger.info(f"Loading target scaler from: {scaler_path}")
            self.target_scaler = joblib.load(scaler_path)
            logger.info("✓ Target scaler loaded successfully")


            # Step 3: Initialize model architecture

            logger.info("Initializing PatchTST architecture...")
            config = self._create_model_config()
            self.model = self._build_patchtst_model(config)
            logger.info("✓ Model architecture initialized")


            # Step 4: Load model weights
            logger.info(f"Loading model weights from: {model_path}")
            self._load_checkpoint(model_path)
            logger.info("✓ Model weights loaded successfully")

            # Validate paths
            if not model_path.exists():
                raise FileNotFoundError(f"Model checkpoint not found at: {model_path}")
   
            if not scaler_path.exists():
                raise FileNotFoundError(f"Scaler not found at: {scaler_path}")
            
            # Load components
            # Step 5: Move model to device and set to eval mode
            self.model = self.model.to(self.device)
            self.model.eval()
            logger.info(f"✓ Model moved to device: {self.device}")



            success_message = (
                f"PatchTST model loaded successfully!\n"
                f"  - Device: {self.device}\n"
                f"  - Sequence length: {self.seq_len}\n"
                f"  - Horizon: {self.horizon_len}\n"
                f"  - Targets: {self.num_targets}\n"
            )

            logger.info(success_message)
            return self

        except FileNotFoundError as e:
            error_msg = f"Failed to load PatchTST: {e}"
            logger.error(error_msg)
            raise
        

        except Exception as e:
            error_msg = f"Unexpected error loading PatchTST: {e}"
            logger.error(error_msg, exc_info=True)
            raise RuntimeError(error_msg) from e
        



    
    def transform(self, predictions: list[PredictionResult]) -> dict:


        """
        Transform LightGBM predictions into model input.

         Workflow:
        1. Take LightGBM predictions (weekly forecasts for each target)
        2. Scale target values
        3. Create sequences
        4. Return batched data ready for forecasting
        Returns:
            dict containing:
                - 'y_past_batch': Tensor [num_samples, seq_len, num_targets]
                - 'y_future_batch': Tensor [num_samples, horizon, num_targets]
                - 'num_samples': int
                - 'horizon': int
                - 'total_weeks': int
        """


        # Step 1: Convert LightGBM predictions to DataFrame
        predictions_df =pd.DataFrame(predictions, columns=self.targets)
        print(predictions_df.head())
        # logger.info(f"✓ Predictions DataFrame created: {predictions_df.shape}")

        # logger.info(f"The columns are: {predictions_df.columns}")
        # # Step 3: Extract and scale target values
        # y_data = predictions_df[self.targets]
        # logger.info(f"The columns are: {predictions_df.columns}")

        # logger.info(f"✓ Target data shape before scaling: {y_data.shape}")

        y_scaled = self.target_scaler.transform(predictions_df)
        logger.info(f"  ✓ Target data scaled: {y_scaled.shape}")



        # Step 4: Create sequences
        dataset = ClimateHealthDataset(
            y_data=y_scaled,
            seq_len=self.seq_len,
            horizon_len=self.horizon_len
        )

        logger.info(f"  ✓ Dataset created with {len(dataset)} samples")

        #validate dataset
        if len(dataset) == 0:
            raise ValueError(
                f"No samples created! Need at least {self.seq_len} weeks of LightGBM predictions. "
                f"Current predictions: {len(predictions_df)} weeks"
            )
        
        # Step 5: Get all samples as batch
        y_past_batch, y_future_batch = dataset.get_all_batched()

        logger.info("✓     Batched data:")
        logger.info(f"    - y_past shape: {y_past_batch.shape}")
        logger.info(f"    - y_future shape: {y_future_batch.shape}")


        # Prepare result
        self.transform_result = {
            'y_past_batch': y_past_batch,
            'y_future_batch': y_future_batch,
            'num_samples': len(dataset),
            'horizon': self.horizon_len,
            'total_weeks': len(predictions_df),
        }


        logger.info("PatchTST Transform: Completed successfully")

        return self
    

    
    def forecast(self):

        """
        Generate future forecasts using PatchTST model.
        
        This function:
        1. Takes transformed data (batched sequences)
        2. Runs model inference on all sequences
        3. Collapses overlapping predictions
        4. Inverse scales to original values
        5. Returns formatted response with confidence intervals
        
        Args:
            req: ForecastRequest containing:
                - model_id: Model identifier
            
            transformed_data: Dictionary from transform() containing:
                - 'y_past_batch': Tensor [num_samples, seq_len, num_targets]
                - 'y_future_batch': Tensor [num_samples, horizon, num_targets]
                - 'num_samples': int
                - 'horizon': int
                - 'total_weeks': int
        
        Returns:
            ForecastResponse with:
                - predictions: List of weekly predictions with CI
                - model_used: Model ID
                - forecast_start_date: First forecast date
                - forecast_end_date: Last forecast date
                - metadata: Additional info
        """

        logger.info("PatchTST Forecast: Generating future predictions")

        
        # Extract data from transformed_data
        y_past_batch = self.transform_result['y_past_batch'].to(self.device)
        num_samples = self.transform_result['num_samples']
        horizon = self.transform_result['horizon']
        logger.info("Input data:")
        logger.info(f"  - Samples: {num_samples}")
        logger.info(f"  - Batch shape: {y_past_batch.shape}")
        logger.info(f"  - Horizon: {horizon} weeks")

        # Step 1: Move data to device
        logger.info(f"\nStep 1: Moving data to device ({self.device})...")
        y_past_batch = y_past_batch.to(self.device)
        logger.info("  ✓ Data on device")

        
        # Step 2: Run model inference
        logger.info("\nStep 2: Running model inference...")
        with torch.no_grad():
            model_outputs = self.model(y_past_batch)
            Predictions_scaled = model_outputs.predictions  # [num_samples, horizon, num_targets]


        logger.info("  ✓ Model inference completed")
        logger.info(f"  - Predictions shape: {Predictions_scaled.shape}")

        # Move to CPU for processing
        Predictions_scaled = Predictions_scaled.cpu()

        # Step 3: Collapse overlapping predictions with confidence intervals
        z_score = self._get_z_score()
        logger.info(f"  - Confidence level: 95% (z-score: {z_score})")

        collapsed_preds, (lower_bound, upper_bound) = collapse_overlapping_predictions(
            all_preds=Predictions_scaled,
            z_score=z_score
        )

        logger.info("✓   Predictions collapsed")
        logger.info(f"  - Collapsed shape: {collapsed_preds.shape}")
        logger.info(f"  - Lower bound shape: {lower_bound.shape}")
        logger.info(f"  - Upper bound shape: {upper_bound.shape}")


        # Step 4: Inverse scale to original values

        # Flatten for inverse transform
        collapsed_preds_flat = collapsed_preds.reshape(-1, self.num_targets)
        lower_bound_flat = lower_bound.reshape(-1, self.num_targets)
        upper_bound_flat = upper_bound.reshape(-1, self.num_targets)

        # Inverse transform
        forecasts_unscaled = self.target_scaler.inverse_transform(collapsed_preds_flat.numpy())
        lower_bound_unscaled = self.target_scaler.inverse_transform(lower_bound_flat.numpy())
        upper_bound_unscaled = self.target_scaler.inverse_transform(upper_bound_flat.numpy())


        # Reshape back
        forecasts_unscaled = forecasts_unscaled.reshape(horizon, self.num_targets)
        lower_bound_unscaled = lower_bound_unscaled.reshape(horizon, self.num_targets)
        upper_bound_unscaled = upper_bound_unscaled.reshape(horizon, self.num_targets)



        logger.info("  ✓ Inverse scaling completed")
        logger.info(f"  - Final forecasts shape: {forecasts_unscaled.shape}")



        # # Step 5: Generate future dates
        # start_date = today_date + timedelta(weeks=1)
        # future_dates = [start_date + timedelta(weeks=i) for i in range(horizon)]


        # logger.info(f"  ✓ Forecast period: {future_dates[0]} → {future_dates[-1]}")

        """ append predictions & lower/upper bounds to response format and confidence intervals """
        response = {
            'forecasts': forecasts_unscaled.tolist(),
            'lower_bound': lower_bound_unscaled.tolist(),
            'upper_bound': upper_bound_unscaled.tolist(),

        }

        logger.info("PatchTST Forecast: Completed successfully")
        return response
        




    def _create_model_config(self):
        """
        Create model configuration.
        
        Returns:
            SimpleNamespace with model configuration
        """
        
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
    
    def _build_patchtst_model(self, config):
        """
        Build PatchTST model architecture.
        
        Args:
            config: Model configuration
        
        Returns:
            PatchTSTWrapper model
        """
        model_config = PatchTSTConfig(
            num_input_channels=self.num_targets,
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
        
        return PatchTSTWrapper(model_config)
    
    def _load_checkpoint(self, model_path: Path):
        """
        Load model weights from checkpoint.
        
        Args:
            model_path: Path to checkpoint file
        """
        logger.info(f"Loading checkpoint from: {model_path}")
        
        with open(model_path, 'rb') as f:
            checkpoint = pickle.load(f)
        
        # Extract state dict
        if isinstance(checkpoint, dict):
            state_dict = checkpoint.get('model_state_dict', checkpoint)
        else:
            state_dict = checkpoint
        
        # Load weights
        self.model.load_state_dict(state_dict, strict=False)
        
        logger.info("Checkpoint loaded successfully")

    def _get_z_score(self, confidence_level: float = 0.95) -> float:
        """
        Get z-score for confidence level.
        
        Args:
            confidence_level: Confidence level (e.g., 0.95 for 95%)
        
        Returns:
            Z-score value
        """
        z_scores = {
            0.90: 1.645,
            0.95: 1.96,
            0.99: 2.576,
        }
        
        return z_scores.get(confidence_level, 1.96)
    
    
class PatchTSTWrapper(nn.Module):
    """
    Wrapper around HuggingFace PatchTST model.
    """
    
    def __init__(self, config):
        super().__init__()
        self.patchtst_model = PatchTSTForPrediction(config)


    def forward(self, y_past):
        """
        Forward pass.
        
        Args:
            y_past: Past values [batch, seq_len, num_targets]
        
        Returns:
            Model output with predictions
        """
        # Create dummy future values (not used in prediction mode)
        batch_size, seq_len, num_targets = y_past.shape
        prediction_length = self.patchtst_model.config.prediction_length
        
        dummy_future = torch.zeros(
            batch_size, prediction_length, num_targets,
            device=y_past.device, dtype=y_past.dtype
        )
        
        outputs = self.patchtst_model(past_values=y_past, future_values=dummy_future)
        return outputs