import logging

from src.domain.schemas.sequential_schemas import ForecastRequest
from src.infrastructure.ml.models.sequential_model_factory import SequentialModelFactory

logger = logging.getLogger(__name__)


class ForecastService:
    def __init__(self, settings):
        self.settings = settings

    def forecast(self, req: ForecastRequest, predictions: list[list[float]]):
        factory = SequentialModelFactory(self.settings)
        model = factory.get_instance(req.model_id)
        return model.load().transform(predictions).forecast()
