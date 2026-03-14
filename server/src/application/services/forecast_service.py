import logging

import pandas as pd

from config import Settings
from src.domain.schemas.forecasts import ForecastRequest
from src.infrastructure.data.historical_repository import HistoricalRepository
from src.infrastructure.ml.model_loader import ModelLoader
from src.infrastructure.ml.models.sequential_model_factory import SequentialModelFactory

logger = logging.getLogger(__name__)


class ForecastService:
    def __init__(self, historical_repository: HistoricalRepository, settings: Settings, model_loader: ModelLoader):
        self.historical_repository = historical_repository

        self.settings = settings
        self.model_loader = model_loader

    def forecast(self, req: ForecastRequest, environment_df: pd.DataFrame):
        """
        Run a forecast given an environment with it's predictions from lightgbm.
        """
        factory = SequentialModelFactory(self.settings, self.model_loader)
        model = factory.get_instance(req.model_id)

        historical_indicators = self.historical_repository.get_indicators(req.country_code)
        return model.load().transform(environment_df, historical_indicators).forecast()
