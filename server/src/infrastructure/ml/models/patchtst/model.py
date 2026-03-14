import logging
import pickle

import joblib
import numpy as np
import pandas as pd
import torch
from sklearn.preprocessing import StandardScaler
from torch.utils.data import DataLoader
from transformers import PatchTSTConfig, PatchTSTForPrediction

from config import Settings
from src.infrastructure.ml.model_loader import ModelLoader
from src.infrastructure.ml.models.patchtst.dataset import ClimateHealthDataset
from src.infrastructure.ml.models.sequential_model import SequentialModel

logger = logging.getLogger(__name__)


class PatchTST(SequentialModel):
    def __init__(self, settings: Settings, model_loader: ModelLoader):
        SequentialModel.__init__(self, settings, model_loader)

        # Model components
        self._model: PatchTSTForPrediction | None = None
        self.__target_scaler: StandardScaler | None = None
        self._is_loaded = False

        # Model configuration
        self.seq_len = 12
        self.horizon_len = 6
        self.num_targets = len(self.settings.targets)

    def load(self):
        if self._is_loaded:
            return self

        # Load target scaler
        self.__target_scaler = joblib.load(self.settings.patchtst_scaler_path)

        # Initialize model architecture
        model_config = PatchTSTConfig(num_input_channels=self.num_targets, loss="mse", **self.__create_model_config())
        self._model = PatchTSTForPrediction(model_config).to(self.settings.device).eval()

        # Load model weights
        self.__load_checkpoint(self.settings.patchtst_model_path)

        self._is_loaded = True

        return self

    def _transform(self, environment_df: pd.DataFrame, _) -> dict:
        predictions_df = environment_df[self.settings.targets]
        historical_y_scaled_df = self.__target_scaler.transform(predictions_df)
        self.dataset = ClimateHealthDataset(historical_y_scaled_df, self.settings.targets, self.seq_len)

        return self

    def _forecast(self):
        predictions_3d_unscaled = self.__run_inference()
        point_predictions, uncertainity = self.__collapse_overlapping_forecasts(predictions_3d_unscaled)
        return self.horizon_len, self._post_transform(point_predictions, uncertainity)

    def __run_inference(self) -> np.ndarray[np.ndarray[float]]:
        if self.dataset is None or len(self.dataset) == 0:
            raise ValueError(f"No samples created! Need at least {self.seq_len} weeks of LightGBM predictions. ")

        loader = DataLoader(self.dataset, batch_size=len(self.dataset))

        # Run model inference
        with torch.no_grad():
            y_past = next(iter(loader))
            model_outputs = self._model.forward(past_values=y_past)
            predictions_scaled = model_outputs.prediction_outputs  # [num_samples, horizon, num_targets]

        # Flatten - 2D format
        preds_flat_scaled = predictions_scaled.contiguous().view(-1, predictions_scaled.size(-1))

        # Inverse transform flattened versions
        preds_flat_unscaled = torch.from_numpy(self.__target_scaler.inverse_transform(preds_flat_scaled.numpy())).float()

        # Reshape unscaled back to 3D
        original_shape = predictions_scaled.shape
        preds_3d_unscaled = preds_flat_unscaled.reshape(original_shape)

        logger.info(f"Predictions shape: {preds_3d_unscaled.shape}")

        return preds_3d_unscaled.cpu()

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

    def __load_checkpoint(self, model_path: str):
        with open(model_path, "rb") as f:
            checkpoint = pickle.load(f)

        self._model.load_state_dict(checkpoint.get("model_state_dict"), strict=False)

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
            final_std.append(preds_at_t.std(dim=0, unbiased=False))

        collapsed_preds = torch.stack(final_preds)
        prediction_std = torch.stack(final_std)

        return collapsed_preds, prediction_std
