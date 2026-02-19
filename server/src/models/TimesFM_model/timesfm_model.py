import logging
import numpy as np
import timesfm
from config import Settings
from src.domain.schemas.predictions import PredictionResult
from src.models.SequentialModel import SequentialModel
import torch.nn as nn
logger = logging.getLogger(__name__)


class TimesFM(nn.Module, SequentialModel):
    
    def __init__(self, settings: Settings):
        nn.Module.__init__(self)
        SequentialModel.__init__(self, settings)
        
        self.max_context = 512 # temp for now
        self.max_horizon = 128
        self._model: timesfm.TimesFM_2p5_200M_torch | None = None
        self._loaded: bool = False
        self.transformed_series: dict[str, np.ndarray] = {}

    
    def load(self) -> None:
        if self._loaded:
            return

        self._model = timesfm.TimesFM_2p5_200M_torch.from_pretrained(
            "google/timesfm-2.5-200m-pytorch"
        )

        self._model.compile(
            timesfm.ForecastConfig(
                max_context=self.max_context,
                max_horizon=self.max_horizon,
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
            raise ValueError(
                f"Expected shape (n, 5), got {predictions_np.shape}"
            )

        targets = [
            "respiratory_disease_rate",
            "cardio_mortality_rate",
            "vector_disease_risk_score",
            "waterborne_disease_incidents",
            "heat_related_admissions",
        ]

        transformed: dict[str, np.ndarray] = {}

        for i, name in enumerate(targets):
            series = predictions_np[:, i]

            if len(series) > self.max_context:
                logger.info(f"{name}: slicing to last {self.max_context}")
                series = series[-self.max_context:]

            transformed[name] = series

        self.transformed_series = transformed
        return self



    def forecast(
        self,
        horizon: int = 128
    ) -> dict[str, list[float]]:
        """
        Returns:
            Dict[str, List[float]]
            where each key is a target name
            and value is forecasted horizon values.
        """

        if not self._loaded or self._model is None:
            raise RuntimeError("TimesFM not loaded. Call load() first.")

        if horizon > self.max_horizon:
            raise ValueError(
                f"Horizon {horizon} exceeds max_horizon {self.max_horizon}"
            )

        forecast_results: dict[str, list[float]] = {}

        for name, series in self.transformed_series.items():

            input_series = [series]  # TimesFM expects List[np.ndarray]

            point_forecast, _ = self._model.forecast(
                inputs=input_series,
                horizon=horizon
            )

            forecast_results[name] = point_forecast[0].tolist()

        return forecast_results