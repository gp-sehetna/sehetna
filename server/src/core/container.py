from src.application.services.prediction_service import PredictionService 
from src.application.services.multi_model_prediction_service import MultiModelPredictionService
from src.core.settings import Settings
from src.infrastructure.data.indicator_repository import IndicatorRepository
from src.infrastructure.ml.model_loader import ModelLoader



class ServiceContainer:
    def __init__(self, settings: Settings):
        self.settings = settings
        self.indicator_repository = IndicatorRepository(settings)
        self.model_loader = ModelLoader(settings)
        self.prediction_service = PredictionService(
            indicator_repository=self.indicator_repository,
            model_loader=self.model_loader,
            settings=settings,
        )

    def load(self) -> None:
        self.model_loader.load_all()
        self.indicator_repository.load_all()

    def get_multi_model_service()-> MultiModelPredictionService : 
        return MultiModelPredictionService()
