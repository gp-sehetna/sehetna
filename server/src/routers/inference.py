from fastapi import APIRouter

from src.models.predictor import Predictor
from src.schema.predictions import PredictionRequest, SimulationResponse

__all__ = ["router"]

router = APIRouter()


@router.post("/simulate", response_model=SimulationResponse)
async def simulate(input_data: PredictionRequest):
    result = Predictor.simulate(input_data.data)
    return SimulationResponse(result)
