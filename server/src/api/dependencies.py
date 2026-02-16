from fastapi import Depends, Request

from src.application.services.prediction_service import PredictionService
from server.src.application.services.sequential_forecast_service import SequentialPredictionService
from src.core.container import ServiceContainer
from config import CoreSettings
from typing import Annotated
import logging

logger = logging.getLogger(__name__)
def get_services(request: Request) -> ServiceContainer:
    return request.app.state.services


def get_prediction_service(services: ServiceContainer = Depends(get_services)) -> PredictionService:
    return services.prediction_service

def get_settings() -> CoreSettings:
    """Get application settings."""
    return CoreSettings()

def get_container(settings: Annotated[CoreSettings, Depends(get_settings)]) -> ServiceContainer:
    """
    Get or create the service container singleton.
    
    Args:
        settings: Application settings
        
    Returns:
        ServiceContainer instance
    """

    global _container

    if _container is None:
        logger.info("Initializing ServiceContainer...")
        _container = ServiceContainer(settings)
        _container.load()  # Load all models and repositories
        logger.info("ServiceContainer initialized and loaded")
    
    return _container

# def get_multi_model_service(
#     container: Annotated[ServiceContainer, Depends(get_container)]
# ) -> MultiModelPredictionService:
#     """
#     Get the multi-model prediction service (TimesFM + PatchTST).
    
#     Args:
#         container: Service container
        
#     Returns:
#         MultiModelPredictionService instance
#     """
#     return container.get_multi_model_service()


def get_sequential_service(
    container: Annotated[ServiceContainer, Depends(get_container)]
) -> SequentialPredictionService:
    """Get the sequential prediction service."""
    return container.get_sequential_service()