from fastapi import APIRouter, Depends

from src.api.dependencies import get_prediction_service
from src.application.services.prediction_service import PredictionService
from src.domain.schemas.predictions import PredictionRequest, SimulationResponse

__all__ = ["router"]

router = APIRouter(tags=["inference", "simulation", "predict"])


@router.post("/simulate", response_model=SimulationResponse)
async def simulate(req: PredictionRequest, prediction_service: PredictionService = Depends(get_prediction_service)):
    result = prediction_service.simulate(req, req.lat, req.lon)
    return SimulationResponse(predictions=result)
