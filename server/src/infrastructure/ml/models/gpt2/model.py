import logging

import joblib
import numpy as np
import pandas as pd
import torch
import torch.nn as nn
from sklearn.preprocessing import RobustScaler
from torch.utils.data import DataLoader
from transformers import GPT2Config, GPT2Model

from config import Settings
from src.infrastructure.ml.model_loader import ModelLoader
from src.infrastructure.ml.models.gpt2.dataset import DecoderDataset
from src.infrastructure.ml.models.sequential_model import SequentialModel

logger = logging.getLogger(__name__)


class GPT2Forecaster(SequentialModel):
    def __init__(self, settings: Settings, model_loader: ModelLoader):
        SequentialModel.__init__(self, settings, model_loader)

        # Model components
        self._model: _GPT2Forecaster | None = None
        self.__scaler: RobustScaler | None = None
        self._is_loaded = False

        # Model configuration
        self.seq_len = 52
        self.horizon_len = 13
        self.num_features = len(self.settings.csv_features) + len(self.settings.targets)
        self.num_targets = len(self.settings.targets)

    def load(self):
        if self._is_loaded:
            return self

        # Load target scaler
        self.__scaler = joblib.load(self.settings.gpt2_patchtsmixer_scaler_path)

        # Initialize model architecture
        self._model = (
            _GPT2Forecaster(self.num_features, self.num_targets, self.seq_len, self.horizon_len).to(self.settings.device).eval()
        )

        checkpoint = torch.load(self.settings.gpt2_model_path, map_location=self.settings.device, weights_only=False)
        self._model.load_state_dict(checkpoint["state_dict"])

        self.__device = next(self._model.parameters()).device
        self._is_loaded = True

        return self

    def _transform(self, environment_df: pd.DataFrame, historical_df: pd.DataFrame) -> dict:
        combined_df = pd.concat([historical_df[environment_df.columns], environment_df], ignore_index=True)
        engineered_combined_df = self.model_loader.pipeline.transform(combined_df)
        self.dataset = DecoderDataset(engineered_combined_df, self.seq_len, self.settings.csv_features, self.settings.targets)

        return self

    def _forecast(self):
        point_predictions, uncertainity = self.__run_inference()
        return self.horizon_len, self._post_transform(point_predictions[-1, ...], uncertainity[-1, ...])

    def __autoregressive_forecast(self, context: torch.Tensor, horizon=13, n_targets=5):
        """
        Autoregressive rollout for HORIZON_LEN steps using KV cache.

        Args:
            context: [B, SEQ_LEN, n_features + n_targets]  scaled

        Returns:
            [B, horizon, n_targets]  scaled
        """
        preds_list = []
        past_kv, next_pred = None, None

        with torch.no_grad():
            for step in range(horizon):
                if step == 0:
                    out, past_kv = self._model.forward(context, use_cache=True)
                    next_pred = out[:, -1:, :]  # [B, 1, n_targets]
                else:
                    # Carry forward last known features, replace targets with last prediction
                    last_token = context[:, -1:, :].clone()  # [B, 1, n_features + n_targets]
                    last_token[:, :, -n_targets:] = next_pred

                    cache_len = past_kv.get_seq_length()  # increments automatically each step
                    pos_ids = torch.full((context.shape[0], 1), cache_len, dtype=torch.long, device=self.__device)

                    out, past_kv = self._model.forward(
                        last_token, use_cache=True, past_key_values=past_kv, position_ids=pos_ids
                    )
                    next_pred = out[:, -1:, :]  # [B, 1, n_targets]

                preds_list.append(next_pred.cpu())

        return torch.cat(preds_list, dim=1)  # [B, horizon, n_targets]

    def __mc_dropout_forecast(
        self, model: "_GPT2Forecaster", context: torch.Tensor, horizon=13, n_features=22, n_targets=5, n_samples=20
    ):
        """
        MC Dropout: run autoregressive forecast N times with dropout enabled.

        Args:
            context: [B, SEQ_LEN, n_features + n_targets]  scaled
            n_samples: number of times to run autoregressive forecast for uncertainty

        Returns:
            mean: [B, horizon, n_targets]  mean of all predictions
            std: [B, horizon, n_targets]  standard deviation of all predictions
        """
        model.train()
        all_preds = []
        with torch.no_grad():
            for _ in range(n_samples):
                p = self.__autoregressive_forecast(context, horizon)
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

    def __run_inference(self, n_mc=20):
        """Inference using GPT2Forecaster Model."""

        if self.dataset is None or len(self.dataset) == 0:
            raise ValueError(f"No samples created! Need at least {self.seq_len} weeks of LightGBM predictions. ")

        test_loader = DataLoader(self.dataset, batch_size=256)

        all_cols = self.settings.csv_features + self.settings.targets
        target_indices = [all_cols.index(t) for t in self.settings.targets]

        all_preds, all_stds = [], []

        for x_batch in test_loader:
            x_batch: torch.Tensor = x_batch.to(self.__device)

            # MC Dropout forecast
            mean_pred, std_pred = self.__mc_dropout_forecast(
                self._model, x_batch, self.horizon_len, len(all_cols), len(self.settings.targets), n_mc
            )

            all_preds.append(mean_pred.numpy())
            all_stds.append(std_pred.numpy())

        # Concatenate all batches
        preds_scaled = np.concatenate(all_preds, axis=0)  # [N, H, 5]
        stds_scaled = np.concatenate(all_stds, axis=0)

        # Inverse transform to original scale
        N, H, T = preds_scaled.shape
        preds_flat = preds_scaled.reshape(-1, T)

        target_scales = self.__scaler.scale_[target_indices]

        preds_orig = self.__inverse_scale_targets(preds_flat, target_indices).reshape(N, H, T)
        stds_orig = stds_scaled * target_scales[None, None, :]

        return preds_orig, stds_orig


class _GPT2Forecaster(nn.Module):
    def __init__(
        self,
        n_features=22,
        n_targets=5,
        seq_len=52,
        horizon_len=13,
        d_model=96,
        n_layer=4,
        n_head=4,
        dropout=0.15,
    ):
        super().__init__()

        # Component 1 — Input Projection
        self.input_proj = nn.Sequential(
            nn.Linear(n_features, d_model // 2),
            nn.GELU(),
            nn.Dropout(dropout),
            nn.Linear(d_model // 2, d_model),
            nn.LayerNorm(d_model),
        )
        # Component 2 — GPT2 Backbone (causal mask built-in)
        self.backbone = GPT2Model(
            GPT2Config(
                n_embd=d_model,
                n_layer=n_layer,
                n_head=n_head,
                n_positions=seq_len + horizon_len,
                resid_pdrop=dropout,
                attn_pdrop=dropout,
                embd_pdrop=dropout,
                use_cache=False,  # off during training, on during inference
                vocab_size=1,  # unused, but required by config
            )
        )

        # Component 3 — Output Head
        self.output_head = nn.Sequential(
            nn.Linear(d_model, d_model // 2),
            nn.ReLU(),
            nn.Dropout(dropout),
            nn.Linear(d_model // 2, n_targets),
        )

    def forward(self, x, use_cache=False, past_key_values=None, position_ids=None):
        """
        x: [B, T, n_features]  (features + targets concatenated)
        Returns: preds [B, T, n_targets], past_key_values (if use_cache)
        """
        h = self.input_proj(x)  # [B, T, d_model]
        out = self.backbone.forward(
            inputs_embeds=h,
            use_cache=use_cache,
            past_key_values=past_key_values,
            position_ids=position_ids,
        )
        preds = self.output_head(out.last_hidden_state)  # [B, T, n_targets]
        if use_cache:
            return preds, out.past_key_values
        return preds
