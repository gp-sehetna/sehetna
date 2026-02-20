import logging

import numpy as np
import timesfm

from config import Settings
from src.infrastructure.ml.models.sequential_model import SequentialModel

logger = logging.getLogger(__name__)


class TimesFM(SequentialModel):

    def __init__(self, settings: Settings):
        SequentialModel.__init__(self, settings)

        # Model configuration
        self.seq_len = 512
        self.horizon_len = 128

        # Model components
        self.__model: timesfm.TimesFM_2p5_200M_torch | None = None
        self._loaded: bool = False

    def load(self) -> None:
        if self._loaded:
            return

        self.__model = timesfm.TimesFM_2p5_200M_torch.from_pretrained("google/timesfm-2.5-200m-pytorch")

        self.__model.compile(
            timesfm.ForecastConfig(
                max_context=self.seq_len,
                max_horizon=self.horizon_len,
                normalize_inputs=True,
                use_continuous_quantile_head=True,
                fix_quantile_crossing=True,
            )
        )

        self._loaded = True
        logger.info("TimesFM loaded")
        return self

    def transform(self, predictions: list[list[float]]):

        if predictions is None:
            raise ValueError("Predictions is None")

        predictions_np = np.asarray(predictions, dtype=np.float32)

        if predictions_np.ndim != 2 or predictions_np.shape[1] != 5:
            raise ValueError(f"Expected shape (n, 5), got {predictions_np.shape}")

        transformed: dict[str, np.ndarray] = {}

        for i, name in enumerate(self.settings.targets):
            series = predictions_np[:, i]

            if len(series) > self.seq_len:
                logger.info(f"{name}: slicing to last {self.seq_len}")
                series = series[-self.seq_len :]

            transformed[name] = series

        self.transformed_series = transformed
        return self

    def forecast(self) -> dict[str, list[float]]:
        """
        Returns:
            Dict[str, List[float]]
            where each key is a target name
            and value is forecasted horizon values.
        """

        if not self._loaded or self.__model is None:
            raise RuntimeError("TimesFM not loaded. Call load() first.")

        forecast_results: dict[str, list[float]] = {}

        for name, series in self.transformed_series.items():

            input_series = [series]  # TimesFM expects List[np.ndarray]

            point_forecast, _ = self.__model.forecast(inputs=input_series, horizon=self.horizon_len)

            forecast_results[name] = point_forecast[0].tolist()

        return forecast_results
