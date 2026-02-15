from src.application.services.prediction_service import PredictionService 
from src.application.services.multi_model_prediction_service import MultiModelPredictionService
from src.core.settings import Settings
from src.infrastructure.data.indicator_repository import IndicatorRepository
from src.infrastructure.ml.model_loader import ModelLoader
from src.models.TimesFM_model.timesfm_model import TimesFMModel 
from src.models.PatchTST_model.patchTST_model import PatchTSTModel 
import logging
import torch
import joblib
import pickle
from src.application.services.sequential_prediction_service import SequentialPredictionService
from src.infrastructure.ml.model_orchestrator import ModelOrchestrator
from src.models.PatchTST_model.patchTST_model import PatchTST 
from src.utils.sequential_utils import _create_model_config 
logger = logging.getLogger(__name__)


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


    def _initialize_sequential_components(self) -> None:
        """Initialize sequential prediction models and service."""

        try:
            logger.info("Initializing sequential prediction components...")

            # Load LightGBM components (already loaded by model_loader)
            lightgbm_model = self.model_loader.model
            lightgbm_pipeline = self.model_loader.pipeline

            device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
            logger.info(f"Using device: {device}")

            # Initialize PatchTST model
            model_id = 'patchtst'
            try:
                # Load PatchTST components
                patchtst_path = getattr(self.settings, 'patchtst_model_path', None)
                patchtst_pipeline_path = getattr(self.settings, 'patchtst_pipeline_path', None)
                patchtst_scaler_path = getattr(self.settings, 'patchtst_scaler_path', None)

                if all([patchtst_path, patchtst_pipeline_path, patchtst_scaler_path]):
                    # Load pipeline and scaler
                    pipeline = joblib.load(patchtst_pipeline_path)
                    target_scaler = joblib.load(patchtst_scaler_path)
            

                    # Create model config
                    config = _create_model_config(model_id=model_id , seq_len=12 , horizon_len=6)
                    
                    # Initialize model
                    with open(patchtst_path, 'rb') as f:
                        checkpoint = pickle.load(f)
                
                    num_targets = 5
                    model = PatchTST(config, num_targets)
                    state_dict = checkpoint.get('model_state_dict', checkpoint)
                    model.load_state_dict(state_dict)
                    model = model.to(device)

                    # Store components
                    self._sequential_models[model_id] = model
                    self._sequential_pipelines[model_id] = pipeline
                    self._target_scalers[model_id] = target_scaler

                    logger.info(f"PatchTST model loaded successfully")
                else:
                    logger.warning("PatchTST paths not configured")            
    
            except Exception as e:
                logger.error(f"Error loading PatchTST: {e}", exc_info=True)   

            # Initialize sequential service
            if self._sequential_models:
                self._sequential_service = SequentialPredictionService(
                    lightgbm_model=lightgbm_model,
                    lightgbm_pipeline=lightgbm_pipeline,
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
    # def _initialize_multi_model_components(self) ->None:
    #     """Initialize TimesFM and PatchTST models and orchestrator."""

    #     try:
    #         logger.info("Initializing multi-model components...")

    #          # Initialize TimesFM model
    #         # TODO: Update path when TimesFM model is implemented
    #         timesfm_model_path = getattr(self.settings, 'timesfm_model_path', None)
    #         self._timesfm_model = TimesFMModel(model_path=timesfm_model_path)

    #         # Initialize PatchTST model
    #         patchtst_model_path = getattr(self.settings, 'patchtst_model_path', None)
    #         patchtst_pipeline_path = getattr(self.settings, 'patchtst_pipeline_path', None)
    #         patchtst_scaler_path = getattr(self.settings, 'patchtst_scaler_path', None)

    #         if patchtst_model_path and patchtst_pipeline_path and patchtst_scaler_path:
    #             self._patchtst_model = PatchTSTModel(
    #                 model_path=patchtst_model_path,
    #                 pipeline_path= patchtst_pipeline_path,
    #                 y_scaler_path= patchtst_scaler_path
    #             )
    #         else:
    #             logger.warning("PatchTST model paths not configured in settings")
            
    #         # Initialize orchestrator with both models
    #         self._orchestrator = ModelOrchestrator(
    #             timesfm=self._timesfm_model,
    #             patchtst=self._patchtst_model
    #         )
            
    #         self._multi_model_service = MultiModelPredictionService(
    #             orchestrator= self._orchestrator
    #         )

    #         logger.info("Multi-model components initialized successfully")


    #     except Exception as e:
    #         logger.error(f"Error initializing multi-model components: {e}")



    # def get_multi_model_service(self)-> MultiModelPredictionService : 
    #     """
    #     Get the multi-model prediction service instance.
        
    #     Returns:
    #         MultiModelPredictionService instance
            
    #     Raises:
    #         RuntimeError: If service is not initialized (load() not called)
    #     """
    #     if self._multi_model_service is None:
    #         raise RuntimeError(
    #             "Multi-model service not initialized. Call container.load() first."
    #         )
    #     return self._multi_model_service
        
        
    
