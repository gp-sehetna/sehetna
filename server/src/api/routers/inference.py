# from fastapi import APIRouter, Depends, Query
# from src.api.dependencies import get_prediction_service , get_sequential_service
# from src.application.services.prediction_service import PredictionService
# from src.domain.schemas.predictions import PredictionQueryParams, PredictionRequest, SimulationResponse 
# from src.domain.schemas.sequential_schemas import SequentialForecastResponse , SequentialPredictionRequest
# from src.application.services.sequential_prediction_service import SequentialPredictionService
import logging
from typing import Annotated

from fastapi import APIRouter, Depends, Query

from core.container import ServiceContainer
from src.api.dependencies import get_prediction_service
from src.application.services.prediction_service import PredictionService
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
    result = prediction_service.simulate(req, query)
    return SimulationResponse(predictions=result)





# @router.post("/forecast" , response_model= SequentialForecastResponse)
# async def forecast( 
#     req : SequentialPredictionRequest,
#     prediction_service : SequentialPredictionService = Depends(get_sequential_service),
# ):
#     try:
#         result = prediction_service.predict(req)
#         logger.info("Forecast completed successfully")
#         logger.info(f"Historical weeks: {len(result.historical.weeks)}")
#         logger.info(f"Forecast weeks: {len(result.forecast.weeks)}")

#         return SequentialForecastResponse(predictions=result)
        
#     except Exception as e:
#         logger.error(f"Error during sequential forecast: {e}", exc_info=True)
#     raise


#     predictions, explanations = prediction_service.simulate(req, query)
#     return SimulationResponse.build(predictions, query.explainer_method, explanations)
