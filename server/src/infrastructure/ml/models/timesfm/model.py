import logging
import pandas as pd
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

    def transform(
        self,
        predictions: list[list[float]], # [time steps as ROWs, targets as COLs]
        historical_indicators: pd.DataFrame
    ):

        if predictions is None:
            raise ValueError("Predictions is None")

        if historical_indicators is None:
            raise ValueError("Historical indicators is None")

        predictions_np = np.asarray(predictions, dtype=np.float32)


        transformed: dict[str, np.ndarray] = {}

        for i, name in enumerate(self.settings.targets):

            if name not in historical_indicators.columns:
                raise ValueError(f"{name} not found in historical_indicators")

            
            historical_series = (
                historical_indicators[name]
                .values
                .astype(np.float32)
            )

            # get all time steps predictions for this target
            predicted_series = predictions_np[:, i]

            
            full_series = np.concatenate([historical_series, predicted_series])


            
            if len(full_series) > self.seq_len:
                full_series = full_series[-self.seq_len:]

            transformed[name] = full_series.astype(np.float32)

        self.transformed_series = transformed # {"target1": np.ndarray(shape=(<=512,), dtype=float32),"target2": ...}
        return self 
        

    def forecast(self) -> dict[str, list[float]]:
        
        if not self._loaded or self.__model is None:
            raise RuntimeError("TimesFM not loaded. Call load() first.")

        forecast_results = self._forecast_targets()
        
        return forecast_results
    
    
    def _forecast_targets(self):
        forecast_results: dict[str, tuple[np.ndarray, np.ndarray]] = {}

        for name, series in self.transformed_series.items():
            
            forecast_results[name] = self._forecast_single_target(series)
            
        return forecast_results
    
    def _forecast_single_target(self, series):
        input_series = [series]
        point_forecast, quantile_forecasts = self.__model.forecast(inputs=input_series, horizon=self.horizon_len)
        
        return point_forecast.tolist(), quantile_forecasts.tolist()