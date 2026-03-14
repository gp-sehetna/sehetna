from abc import ABC, abstractmethod

import numpy as np
import pandas as pd
from torch import Tensor

from config import Settings
from src.domain.schemas.forecasts import ForecastResult
from src.infrastructure.ml.model_loader import ModelLoader

TensorLike = np.ndarray | Tensor


class SequentialModel(ABC):
    """
    This is the interface that the models will extend
    every unique behaviour should in a seperate function
    """

    def __init__(self, settings: Settings, model_loader: ModelLoader):
        self.settings = settings
        self.model_loader = model_loader
        self._is_loaded = False
        self._model = None

    def _ensure_loaded(self):
        if not self._is_loaded or self._model is None:
            raise RuntimeError(f"{self.__class__.__name__} Model not loaded. " "Call load() & transform() first.")

    @abstractmethod
    def load(self) -> "SequentialModel":
        """
        Load the model from the given settings.

        Returns:
                self - The loaded model.
        """

    ...

    def transform(self, environment_df, historical_df=None):
        self._ensure_loaded()
        return self._transform(environment_df, historical_df)

    @abstractmethod
    def _transform(self, environment_df: pd.DataFrame, historical_df: pd.DataFrame) -> "SequentialModel":
        """
        Transform the environment for a specific country.

        Args:
                environment_df: pd.DataFrame - The environment with it's target predictions from lightgbm model.
                historical_df: pd.DataFrame | None - The historical data.

        Returns:
                self - The transformed model.
        """

    ...

    def forecast(self) -> tuple[int, ForecastResult]:
        self._ensure_loaded()
        return self._forecast()

    @abstractmethod
    def _forecast(self) -> tuple[int, ForecastResult]:
        """
        Run a forecast given predictions from a model.

        Returns:
                tuple[int, ForecastResult]
                        - The first element is the horizon length.
                        - The second element is the forecast result.
        """

    ...

    def _post_transform(self, points: TensorLike, stds: TensorLike):
        return self.__build_forecast_dict(points, *self.__compute_boundaries(points, stds, z_score=1.96))

    def __compute_boundaries(self, points: TensorLike, stds: TensorLike, z_score: float = 1.96):
        lower_bound = points - z_score * stds
        upper_bound = points + z_score * stds
        return lower_bound, upper_bound

    def __build_forecast_dict(self, points: TensorLike, lowers: TensorLike, uppers: TensorLike):
        return {
            name: {"point": points[:, i].tolist(), "lower": lowers[:, i].tolist(), "upper": uppers[:, i].tolist()}
            for i, name in enumerate(self.settings.targets)
        }
