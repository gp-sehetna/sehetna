import logging

import numpy as np
import pandas as pd
import timesfm

from config import Settings
from src.infrastructure.ml.model_loader import ModelLoader
from src.infrastructure.ml.models.sequential_model import SequentialModel

logger = logging.getLogger(__name__)


class TimesFM(SequentialModel):

    def __init__(self, settings: Settings, model_loader: ModelLoader):
        SequentialModel.__init__(self, settings, model_loader)

        # Model components
        self._model: timesfm.TimesFM_2p5_200M_torch | None = None
        self._is_loaded: bool = False

        # Model configuration
        self.seq_len = 512
        self.horizon_len = 128

    def load(self) -> None:
        if self._is_loaded:
            return self

        self._model = timesfm.TimesFM_2p5_200M_torch.from_pretrained("google/timesfm-2.5-200m-pytorch")
        self._model.compile(
            timesfm.ForecastConfig(
                max_context=self.seq_len,
                max_horizon=self.horizon_len,
                normalize_inputs=True,
                use_continuous_quantile_head=True,
                fix_quantile_crossing=True,
            )
        )

        self._is_loaded = True
        return self

    def _transform(self, environment_df: pd.DataFrame, historical_df: pd.DataFrame):
        combined = pd.concat([historical_df[self.settings.targets], environment_df[self.settings.targets]], ignore_index=True)
        self.transformed = combined.to_dict(orient="list")

        return self

    def _forecast(self):
        return self.horizon_len, {
            name: {"point": point.tolist(), "lower": lower.tolist(), "upper": upper.tolist()}
            for name, (point, (lower, upper)) in self._forecast_targets().items()
        }

    def _forecast_targets(self):
        forecast_results: dict[str, tuple[np.ndarray, np.ndarray]] = {}

        for name, series in self.transformed.items():
            forecast_results[name] = self._forecast_single_target(series)

        return forecast_results

    def _forecast_single_target(self, series):
        point_forecast, quantile_forecasts = self._model.forecast(inputs=[series], horizon=self.horizon_len)

        logger.debug(f"Point forecast: {point_forecast.shape}")  # [1, horizon]
        logger.debug(f"Quantile forecasts: {quantile_forecasts.shape}")  # [1, horizon, num_quantiles=10]

        return (
            point_forecast[0, ...],
            (quantile_forecasts[0, :, 1], quantile_forecasts[0, :, 9]),  # Get only the 10th and 90th quantiles
        )
