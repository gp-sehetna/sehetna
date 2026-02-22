from abc import ABC, abstractmethod

import numpy as np
import pandas as pd

from config import Settings
from src.domain.schemas.forecasts import ForecastResult


class SequentialModel(ABC):
    """
    This is the interface that the models will extend
    every unique behaviour should in a seperate function
    """

    def __init__(self, settings: Settings):
        self.settings = settings
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

    def transform(self, predictions, historical_df=None):
        self._ensure_loaded()
        return self._transform(predictions, historical_df)

    @abstractmethod
    def _transform(
        self, predictions: np.ndarray[np.ndarray[float]], historical_df: pd.DataFrame | None = None
    ) -> "SequentialModel":
        """
        Transform the predictions using the historical data.

        Args:
            predictions: np.ndarray[np.ndarray[float]] - The predictions from the model.
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
