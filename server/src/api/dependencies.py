import logging
from typing import Annotated

from fastapi import Depends, Request

from src.core.container import ServiceContainer
from config import CoreSettings
from src.application.services.prediction_service import PredictionService
from src.application.services.sequential_forecast_service import SequentialForecastService

logger = logging.getLogger(__name__)
def get_services(request: Request) -> ServiceContainer:
    return request.app.state.services


def get_prediction_service(services: ServiceContainer = Depends(get_services)) -> PredictionService:
    return services.prediction_service

def get_settings() -> CoreSettings:
    """Get application settings."""
    return CoreSettings()


def get_forecast_service(
    container: Annotated[ServiceContainer, Depends(get_services)]
) -> SequentialForecastService:
    """Get the sequential prediction service."""
    return container.forecast_service



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


