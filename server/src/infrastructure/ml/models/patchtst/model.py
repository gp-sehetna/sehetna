import logging
import os
import pickle
from pathlib import Path

import joblib
import pandas as pd
import torch
import torch.nn as nn
from sklearn.preprocessing import StandardScaler
from torch.utils.data import DataLoader
from transformers import PatchTSTConfig, PatchTSTForPrediction

from config import Settings
from src.infrastructure.ml.models.patchtst.dataset import ClimateHealthDataset
from src.infrastructure.ml.models.patchtst.types import PatchTSTForPredictionOutput
from src.infrastructure.ml.models.sequential_model import SequentialModel

logger = logging.getLogger(__name__)


class PatchTST(nn.Module, SequentialModel):
    def __init__(self, settings: Settings):
        nn.Module.__init__(self)
        SequentialModel.__init__(self, settings)

        # Model components (will be loaded)
        self.__model: PatchTSTForPrediction | None = None
        self.__target_scaler: StandardScaler | None = None

        # Model configuration
        self.seq_len = 12
        self.horizon_len = 6
        self.num_targets = len(self.settings.targets)

    def load(self):
        # Validate paths
        if not os.path.exists(self.settings.patchtst_model_path):
            raise FileNotFoundError(f"Model checkpoint not found at: {self.settings.patchtst_model_path}")

        if not os.path.exists(self.settings.patchtst_scaler_path):
            raise FileNotFoundError(f"Scaler not found at: {self.settings.patchtst_scaler_path}")

        # Load target scaler
        self.__target_scaler = joblib.load(self.settings.patchtst_scaler_path)
        logger.info("Target scaler loaded successfully")

        # Initialize model architecture
        model_config = PatchTSTConfig(num_input_channels=self.num_targets, loss="mse", **self.__create_model_config())
        self.__model = PatchTSTForPrediction(model_config)
        logger.info("Model architecture initialized")

        # Load model weights
        self.__load_checkpoint(self.settings.patchtst_model_path)
        logger.info("Model weights loaded successfully")

        # Move model to device and set to eval mode
        self.__model = self.__model.to(self.settings.device).eval()

        return self

    def transform(self, predictions: list[list[float]]) -> dict:
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

        # Convert predictions to DataFrame
        predictions_df = pd.DataFrame(predictions, columns=self.settings.targets)
        logger.info(f"Predictions DataFrame created: {predictions_df.shape}")

        # Scale target values
        historical_y_scaled_df = self.__target_scaler.transform(predictions_df)
        logger.info(f"Target data scaled: {historical_y_scaled_df.shape}")

        # Create sequences
        self.dataset = ClimateHealthDataset(historical_y_scaled_df, self.settings.targets, self.seq_len)
        logger.info(f"Dataset created with {len(self.dataset)} samples")

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

        Returns:
            ForecastResponse with:
                - forecasts: List of weekly predictions with CI
                - lower_bound: Lower bound of CI
                - upper_bound: Upper bound of CI
        """

        if self.dataset is None or len(self.dataset) == 0:
            raise ValueError(f"No samples created! Need at least {self.seq_len} weeks of LightGBM predictions. ")

        logger.info("PatchTST Forecast: Generating future predictions")

        """Use the whole dataset as input to the model (no batches as the test data is small)"""

        loader = DataLoader(self.dataset, batch_size=len(self.dataset))

        # Run model inference
        with torch.no_grad():
            y_past = next(iter(loader))
            model_outputs = self.forward(y_past)
            predictions_scaled = model_outputs.prediction_outputs  # [num_samples, horizon, num_targets]

        logger.info(f"Predictions shape: {predictions_scaled.shape}")

        # Move to CPU for processing
        predictions_scaled = predictions_scaled.cpu()

        collapsed_preds, (lower_bound, upper_bound) = self.__post_transform_forecasts(all_preds=predictions_scaled)

        logger.info(
            f"Predictions collapsed\n"
            f"- Collapsed shape: {collapsed_preds.shape}\n"
            f"- Lower bound shape: {lower_bound.shape}\n"
            f"- Upper bound shape: {upper_bound.shape}"
        )

        # Flatten for inverse transform
        collapsed_preds_flat = collapsed_preds.reshape(-1, self.num_targets)
        lower_bound_flat = lower_bound.reshape(-1, self.num_targets)
        upper_bound_flat = upper_bound.reshape(-1, self.num_targets)

        # Inverse transform
        forecasts_unscaled = self.__target_scaler.inverse_transform(collapsed_preds_flat.numpy())
        lower_bound_unscaled = self.__target_scaler.inverse_transform(lower_bound_flat.numpy())
        upper_bound_unscaled = self.__target_scaler.inverse_transform(upper_bound_flat.numpy())

        # Reshape back
        forecasts_unscaled = forecasts_unscaled.reshape(self.horizon_len, self.num_targets)
        lower_bound_unscaled = lower_bound_unscaled.reshape(self.horizon_len, self.num_targets)
        upper_bound_unscaled = upper_bound_unscaled.reshape(self.horizon_len, self.num_targets)

        logger.info("Inverse scaling completed")
        logger.info(f"- Final forecasts shape: {forecasts_unscaled.shape}")

        response = {
            "forecasts": forecasts_unscaled.tolist(),
            "lower_bound": lower_bound_unscaled.tolist(),
            "upper_bound": upper_bound_unscaled.tolist(),
        }

        return response

    def __create_model_config(self) -> dict:
        return dict(
            context_length=self.seq_len,
            prediction_length=self.horizon_len,
            d_model=128,
            num_attention_heads=32,
            num_hidden_layers=8,
            patch_length=6,
            stride=8,
            dropout=0.11,
        )

    def __load_checkpoint(self, model_path: Path):
        with open(model_path, "rb") as f:
            checkpoint = pickle.load(f)

        self.__model.load_state_dict(checkpoint.get("model_state_dict"), strict=False)

    def __collapse_overlapping_forecasts(self, all_preds: torch.Tensor):
        S, H, _ = all_preds.shape

        # Create a structure to hold all predictions for each timestep
        # Total timesteps = num_sequences + horizon_len - 1
        total_timesteps = S + H - 1

        # Dictionary to store all predictions for each future timestep
        timestep_preds = {i: [] for i in range(total_timesteps)}

        # Collect predictions for each timestep
        for seq_idx in range(S):
            for h in range(H):
                future_timestep = seq_idx + h
                timestep_preds[future_timestep].append(all_preds[seq_idx, h, :])

        # Get predictions for the LAST horizon_len timesteps
        final_preds, final_std = [], []

        for t in range(total_timesteps - H, total_timesteps):
            preds_at_t = torch.stack(timestep_preds[t])
            final_preds.append(preds_at_t.mean(dim=0))

            # Standard deviation across overlapping predictions (uncertainty!)
            final_std.append(preds_at_t.std(dim=0))

        collapsed_preds = torch.stack(final_preds)
        prediction_std = torch.stack(final_std)

        return collapsed_preds, prediction_std

    def __compute_confidence_intervals(self, forecasts: torch.Tensor, std: torch.Tensor, z_score: float = 1.96):
        lower_bound = forecasts - z_score * std
        upper_bound = forecasts + z_score * std
        return lower_bound, upper_bound

    def __post_transform_forecasts(self, all_preds: torch.Tensor, z_score=1.96):
        """
        This function averages the overlapping predictions and
        computes uncertainty estimates (standard deviation) & confidence intervals (lower and upper bounds)

        Args:
            all_preds: Tensor of shape (num_samples, horizon, num_targets)
            z_score: Z-score for computing confidence intervals

        Returns:
            collapsed_forecasts: Tensor of shape (horizon, num_targets)
            (lower_bound, upper_bound): Tuple of lower and upper bounds
        """
        collapsed_forecasts, uncertainity = self.__collapse_overlapping_forecasts(all_preds)
        lower_bound, upper_bound = self.__compute_confidence_intervals(collapsed_forecasts, uncertainity, z_score)
        return collapsed_forecasts, (lower_bound, upper_bound)

    def forward(self, y_past, y_future=None) -> PatchTSTForPredictionOutput:
        if not self.__model:
            raise RuntimeError("Model not initialized")

        return self.__model.forward(past_values=y_past, future_values=y_future)
