from typing import Annotated

from fastapi import APIRouter, Depends, Query

from src.api.dependencies import get_prediction_service
from src.application.services.prediction_service import PredictionService
from src.domain.schemas.predictions import PredictionQueryParams, PredictionRequest, SimulationResponse

__all__ = ["router"]

router = APIRouter(tags=["inference"])


@router.post("/simulate", response_model=SimulationResponse)
async def simulate(
    req: PredictionRequest,
    query: Annotated[PredictionQueryParams, Query()],
    prediction_service: PredictionService = Depends(get_prediction_service),
):
    result = prediction_service.simulate(req, query)
    return SimulationResponse(predictions=result)
