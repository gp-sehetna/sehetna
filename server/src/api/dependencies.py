from fastapi import Depends, Request

from src.application.services.prediction_service import PredictionService
from src.core.container import ServiceContainer


def get_services(request: Request) -> ServiceContainer:
    return request.app.state.services


def get_prediction_service(services: ServiceContainer = Depends(get_services)) -> PredictionService:
    return services.prediction_service
