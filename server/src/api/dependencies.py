import logging
from typing import Annotated

from fastapi import Depends, Request

from src.application.services.prediction_service import PredictionService
from src.application.services.sequential_forecast_service import SequentialForecastService
from src.core.container import ServiceContainer

logger = logging.getLogger(__name__)


def get_services(request: Request) -> ServiceContainer:
    return request.app.state.services


def get_prediction_service(services: ServiceContainer = Depends(get_services)) -> PredictionService:
    return services.prediction_service


def get_forecast_service(container: Annotated[ServiceContainer, Depends(get_services)]) -> SequentialForecastService:
    return container.forecast_service
