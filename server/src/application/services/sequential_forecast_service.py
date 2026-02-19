import logging

from src.domain.schemas.sequential_schemas import ForecastRequest
from src.models.ForecastModelFactory import ForecastModelFactory

logger = logging.getLogger(__name__)


class SequentialForecastService:
    """
    1- Call the factory
    2- Load
    3- Pre-transform
    4- Forecast
    5- Post-transform
    """

    def __init__(self, settings):
        self.settings = settings

    def forecast(self, req: ForecastRequest, predictions: list[list[float]]):
        factory = ForecastModelFactory(self.settings)
        model = factory.get_instance(req.model_id)
        return model.load().transform(predictions).forecast()
