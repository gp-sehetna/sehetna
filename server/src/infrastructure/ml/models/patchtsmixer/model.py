import logging

import joblib
import numpy as np
import pandas as pd
import torch
import torch.nn as nn
from sklearn.preprocessing import RobustScaler
from torch.utils.data import DataLoader
from transformers import PatchTSMixerConfig, PatchTSMixerForPrediction

from config import Settings
from src.infrastructure.ml.model_loader import ModelLoader
from src.infrastructure.ml.models.patchtsmixer.dataset import PatchTSMixerDataset
from src.infrastructure.ml.models.sequential_model import SequentialModel

logger = logging.getLogger(__name__)


class PatchTSMixerForecaster(SequentialModel):
    def __init__(self, settings: Settings, model_loader: ModelLoader):
        SequentialModel.__init__(self, settings, model_loader)

        # Model components
        self._model: _PatchTSMixerModule | None = None
        self.__scaler: RobustScaler | None = None
        self._is_loaded = False

        # Model configuration
        self.seq_len = 52
        self.horizon_len = 26
        self.num_features = len(self.settings.csv_features) + len(self.settings.targets)
        self.num_targets = len(self.settings.targets)

    def load(self):
        if self._is_loaded:
            return self

        # Load target scaler
        self.__scaler = joblib.load(self.settings.gpt2_patchtsmixer_scaler_path)

        # Initialize model architecture
        self._model = (
            _PatchTSMixerModule(self.num_features, self.num_targets, self.seq_len, self.horizon_len)
            .to(self.settings.device)
            .eval()
        )

        checkpoint = torch.load(self.settings.patchtsmixer_model_path, map_location=self.settings.device, weights_only=False)
        self._model.load_state_dict(checkpoint["state_dict"])

        self.__device = next(self._model.parameters()).device
        self._is_loaded = True

        return self

    def _transform(self, environment_df: pd.DataFrame, historical_df: pd.DataFrame) -> dict:
        combined_df = pd.concat([historical_df[environment_df.columns], environment_df], ignore_index=True)
        engineered_combined_df = self.model_loader.pipeline.transform(combined_df)
        self.dataset = PatchTSMixerDataset(
            engineered_combined_df, self.seq_len, self.settings.csv_features, self.settings.targets
        )

        return self

    def _forecast(self):
        point_predictions, uncertainity = self.__run_inference()
        return self.horizon_len, self._post_transform(point_predictions[-1, ...], uncertainity[-1, ...])

    def __mc_dropout_forecast(self, model: "_PatchTSMixerModule", context: torch.Tensor, n_samples=20):
        """
        MC Dropout: run forecast one time with dropout enabled.

        Args:
            model: PatchTSMixerModule
            context: [B, SEQ_LEN, n_features + n_targets] scaled tensor
            n_samples: number of times to run forecast for uncertainty

        Returns:
            mean: [B, horizon, n_targets]  mean of all predictions
            std: [B, horizon, n_targets]  standard deviation of all predictions
        """
        model.train()
        all_preds = []
        with torch.no_grad():
            for _ in range(n_samples):
                p = model(context)
                all_preds.append(p.cpu())
        stacked = torch.stack(all_preds)  # [N, B, H, T]
        model.eval()
        return stacked.mean(dim=0), stacked.std(dim=0)

    def __inverse_scale_targets(self, arr: np.ndarray, target_indices: list[int]) -> np.ndarray:
        """
        Inverse scale the target values of the given array.
        Steps:
            - Create a dummy array with the same shape as the input array
            - Replace the target values in the dummy array with the input array
            - Inverse scale the dummy array
            - Return the inverse scaled array
        """
        dummy = np.zeros((arr.shape[0], len(self.__scaler.center_)))
        dummy[:, target_indices] = arr
        return self.__scaler.inverse_transform(dummy)[:, target_indices]

    def __run_inference(self, n_mc=50):
        """Inference using PatchTSMixer Model."""

        if self.dataset is None or len(self.dataset) == 0:
            raise ValueError(
                f"No samples created! Need at least {self.seq_len} weeks of simulation predictions. (e.g., from LightGBM)"
            )

        test_loader = DataLoader(self.dataset, batch_size=128)

        all_cols = self.settings.csv_features + self.settings.targets
        target_indices = [all_cols.index(t) for t in self.settings.targets]

        all_preds, all_stds = [], []

        for x_batch in test_loader:
            x_batch: torch.Tensor = x_batch.to(self.__device)

            # MC Dropout forecast
            mean_pred, std_pred = self.__mc_dropout_forecast(self._model, x_batch, n_mc)

            all_preds.append(mean_pred.numpy())
            all_stds.append(std_pred.numpy())

        # Concatenate all batches
        preds_scaled = np.concatenate(all_preds, axis=0)  # [SEQ, HORIZON, 5]
        stds_scaled = np.concatenate(all_stds, axis=0)

        # Inverse transform to original scale
        N, H, T = preds_scaled.shape
        preds_flat = preds_scaled.reshape(-1, T)

        target_scales = self.__scaler.scale_[target_indices]

        preds_orig = self.__inverse_scale_targets(preds_flat, target_indices).reshape(N, H, T)
        stds_orig = stds_scaled * target_scales[None, None, :]

        return preds_orig, stds_orig


class _PatchTSMixerModule(nn.Module):
    def __init__(self, n_features=27, n_targets=5, seq_len=52, horizon_len=26):

        super().__init__()
        config = PatchTSMixerConfig(
            scaling=False,
            num_input_channels=n_features,
            context_length=seq_len,
            prediction_length=horizon_len,
            patch_length=8,
            patch_stride=1,
            d_model=64,
            num_layers=2,
            dropout=0.125,
            head_dropout=0.1,
            head_aggregation="avg_pool",
        )
        self.backbone = PatchTSMixerForPrediction(config)
        self.output_proj = nn.Linear(config.num_input_channels, n_targets)

        self.loss_fn = nn.HuberLoss()

    def forward(self, x):
        """
        x   : (B, SEQ_LEN, n_all)   — all features + targets, scaled
        out : (B, HORIZON_LEN, n_targets)
        """
        backbone_out = self.backbone(past_values=x)
        return self.output_proj(backbone_out.prediction_outputs)
