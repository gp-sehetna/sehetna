# from fastapi import APIRouter, Depends, Query
import logging
from typing import Annotated

from fastapi import APIRouter, Depends, Query

from src.api.dependencies import get_forecast_service, get_prediction_service
from src.application.services.forecast_service import ForecastService
from src.application.services.prediction_service import PredictionService
from src.domain.schemas.forecasts import ForecastRequest, ForecastResponse
from src.domain.schemas.predictions import (
    PredictionQueryParams,
    PredictionRequest,
    SimulationResponse,
)

__all__ = ["router"]

router = APIRouter(tags=["inference"])
logger = logging.getLogger(__name__)


@router.post("/simulate", response_model=SimulationResponse)
async def simulate(
    req: PredictionRequest,
    query: Annotated[PredictionQueryParams, Query()],
    prediction_service: PredictionService = Depends(get_prediction_service),
):
    predictions, explanations = prediction_service.simulate(req, query)
    return SimulationResponse.build(predictions, query.explainer_method, explanations)


@router.post("/forecast", response_model=ForecastResponse)
async def forecast(
    req: ForecastRequest,
    prediction_service: PredictionService = Depends(get_prediction_service),
    forecast_service: ForecastService = Depends(get_forecast_service),
):
    predictions, _ = prediction_service.simulate(req)
    horizon_len, forecasts = forecast_service.forecast(req, predictions)

    return ForecastResponse(horizon=horizon_len, forecasts=forecasts)
