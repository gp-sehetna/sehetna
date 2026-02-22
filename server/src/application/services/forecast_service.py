import logging

import numpy as np

from src.domain.schemas.forecasts import ForecastRequest
from src.infrastructure.data.historical_repository import HistoricalRepository
from src.infrastructure.ml.models.sequential_model_factory import SequentialModelFactory

logger = logging.getLogger(__name__)


class ForecastService:
    def __init__(self, historical_repository: HistoricalRepository, settings):
        self.settings = settings
        self.historical_repository = historical_repository

    def forecast(self, req: ForecastRequest, predictions: np.ndarray[np.ndarray[float]]):
        """
        Run a forecast given predictions from a model.

        Args:
            req: ForecastRequest
            predictions: np.ndarray[np.ndarray[float]]

        Returns:
            np.ndarray[np.ndarray[float]]
        """
        factory = SequentialModelFactory(self.settings)
        model = factory.get_instance(req.model_id)

        historical_indicators = self.historical_repository.get_indicators(req.country_code)
        return model.load().transform(predictions, historical_indicators).forecast()
