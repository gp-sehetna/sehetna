import logging

from config import Settings
from src.application.agents.interpreter_agent import build_interpreter_agent
from src.application.services.agent_service import AgentService
from src.application.services.forecast_service import ForecastService
from src.application.services.prediction_service import PredictionService
from src.infrastructure.data.historical_repository import HistoricalRepository
from src.infrastructure.data.indicator_repository import IndicatorRepository
from src.infrastructure.ml.model_loader import ModelLoader

logger = logging.getLogger(__name__)


class ServiceContainer:

    def __init__(self, settings: Settings):
        self.settings = settings
        self.historical_repository = HistoricalRepository(settings)
        self.indicator_repository = IndicatorRepository(settings)
        self.model_loader = ModelLoader(settings)
        self.forecast_service = ForecastService(self.historical_repository, settings, self.model_loader)
        self.agent_service = AgentService(agent = build_interpreter_agent(self.settings))
        # Initialize single-model prediction service (existing LGBM model)
        self.prediction_service = PredictionService(self.indicator_repository, settings, self.model_loader)
    

    def load(self) -> None:
        # Load existing LGBM model and data
        self.model_loader.load_all()
        self.historical_repository.load_all()
        self.indicator_repository.load_all()

        logger.info("All models and repositories loaded successfully")
