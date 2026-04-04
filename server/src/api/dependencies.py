import logging
from typing import Annotated

from fastapi import Depends, Request

from src.application.services.agent_service import AgentService
from src.application.services.forecast_service import ForecastService
from src.application.services.prediction_service import PredictionService
from src.core.container import ServiceContainer

logger = logging.getLogger(__name__)


def get_services(request: Request) -> ServiceContainer:
    return request.app.state.services


def get_prediction_service(services: ServiceContainer = Depends(get_services)) -> PredictionService:
    return services.prediction_service


def get_forecast_service(container: Annotated[ServiceContainer, Depends(get_services)]) -> ForecastService:
    return container.forecast_service

def get_agent_service(container: Annotated[ServiceContainer, Depends(get_services)]) -> AgentService:
    return container.agent_service