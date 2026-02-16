import logging
import pickle

import joblib
import torch

from src.application.services.multi_model_prediction_service import MultiModelPredictionService
from src.application.services.prediction_service import PredictionService
from src.application.services.sequential_prediction_service import SequentialPredictionService
from src.core.settings import Settings
from src.infrastructure.data.indicator_repository import IndicatorRepository
from src.infrastructure.ml.model_loader import ModelLoader
from src.infrastructure.ml.model_orchestrator import ModelOrchestrator
from src.models.PatchTST_model.patchTST_model import PatchTST, PatchTSTModel
from src.models.TimesFM_model.timesfm_model import TimesFMModel
from src.utils.sequential_utils import _create_model_config

logger = logging.getLogger(__name__)
from abc import ABC, abstractmethod



class BaseSequentialModel(ABC):

    @abstractmethod
    def load(self):
        """Each model implements its own loading logic"""
        pass
    
    @abstractmethod
    def predict(self, predictions: list[list[float]]) -> list[list[float]]:
        """Each model implements its own predict logic"""
        pass



class ServiceContainer:



    
    def __init__(self, settings: Settings):
        self.settings = settings
        self.indicator_repository = IndicatorRepository(settings)
        self.model_loader = ModelLoader(settings)

        # Initialize single-model prediction service (existing LGBM model)
        self.prediction_service = PredictionService( 
            indicator_repository=self.indicator_repository,
            model_loader=self.model_loader,
            settings=settings,
        )

        # Sequential prediction components (TimesFM + PatchTST)
        self._sequential_service = None
        self._sequential_models = {}
        self._sequential_pipelines = {}
        self._target_scalers = {}

        logger.info("ServiceContainer initialized")




    def load(self) -> None:
        # Load existing LGBM model and data
        self.model_loader.load_all()
        self.indicator_repository.load_all()


        # Initialize sequential prediction components
        self._initialize_sequential_components()

        logger.info("All models and repositories loaded successfully")


    def sequential_model_factory(model_id: str) -> BaseSequentialModel:
        """Return the appropriate model class based on model_id"""
        mapping = {
            "patchtst": PatchTST,
            # "timesfm": TimesFM,
        }

        model_class = mapping.get(model_id.lower())
        if not model_class:
            raise ValueError(f"Unknown model_id: {model_id}")

        return model_class()
    



    def _initialize_sequential_components(self) -> None:
        """Initialize sequential prediction models and service."""

        try:
            logger.info("Initializing sequential prediction components...")

            device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
            logger.info(f"Using device: {device}")
            """get model_id from request """
            model_id = "patchtst"  
            model = self.sequential_model_factory(model_id)

            model.load()


            # Initialize sequential service
            if self._sequential_models:
                self._sequential_service = SequentialPredictionService(
                    sequential_models=self._sequential_models,
                    sequential_pipelines=self._sequential_pipelines,
                    target_scalers=self._target_scalers,
                    device=str(device)
                )                 
                
                logger.info(f"Sequential service initialized with models: {list(self._sequential_models.keys())}")
            else:
                logger.warning("No sequential models loaded")

        # TODO: Add TimesFM and other models here
        # Similar pattern as PatchTST above
            
        except Exception as e:
            logger.error(f"Error initializing sequential components: {e}", exc_info=True)



    def get_sequential_service(self) -> SequentialPredictionService:
        """
        Get the sequential prediction service instance.
        
        Returns:
            SequentialPredictionService instance
            
        Raises:
            RuntimeError: If service is not initialized
        """
        if self._sequential_service is None:
            raise RuntimeError(
                "Sequential service not initialized. Call container.load() first."
            )
        return self._sequential_service
 