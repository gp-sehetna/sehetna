from fastapi import APIRouter

from src.models.predictor import Predictor
from src.schema.predictions import PredictionRequest, SimulationResponse

__all__ = ["router"]

router = APIRouter(tags=["inference"])


@router.post("/simulate", response_model=SimulationResponse)
async def simulate(req: PredictionRequest):
    lat, lon = req.coords.split(",")
    result = Predictor.simulate(req, float(lat), float(lon))
    return SimulationResponse(predictions=result)
