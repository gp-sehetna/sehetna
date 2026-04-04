# from fastapi import APIRouter, Depends, Query
import logging
from typing import Annotated

import pandas as pd
from fastapi import APIRouter, Depends, Query

from src.api.dependencies import get_agent_service, get_forecast_service, get_prediction_service
from src.application.services.agent_service import AgentService
from src.application.services.forecast_service import ForecastService
from src.application.services.prediction_service import PredictionService
from src.domain.schemas.agent import InterpretationRequest, InterpretationResponse, SimulationOutcomes
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
    agent_service: AgentService = Depends(get_agent_service),
):
    environment_df, predictions, explanations = prediction_service.simulate(req, query)
    # simulationResults =  SimulationResponse.build(predictions, query.explainer_method, explanations)
    
    pred = predictions[0]
    simulation_outcomes = SimulationOutcomes(
        respiratory_disease_rate=float(pred[0]),
        cardio_mortality_rate=float(pred[1]),
        vector_disease_risk_score=float(pred[2]),
        waterborne_disease_incidents=int(pred[3]),
        heat_related_admissions=int(pred[4]),
    )
    
    
    interpretation = await interpret_prediction(
        body=InterpretationRequest(
            country=req.country_code,
            simulation_outcomes=simulation_outcomes,
            environmental_data=environment_df.astype(str).to_dict(orient="records"),
        ),
        agent_service=agent_service, 
    )

    return SimulationResponse.build(
        predictions,
        query.explainer_method,
        explanations,
        interpretation.message, 
    )




@router.post("/forecast", response_model=ForecastResponse)
async def forecast(
    req: ForecastRequest,
    prediction_service: PredictionService = Depends(get_prediction_service),
    forecast_service: ForecastService = Depends(get_forecast_service),
):
    environment_df, predictions, _ = prediction_service.simulate(req)
    environment_predictions_df = pd.concat(
        [environment_df, pd.DataFrame(predictions, columns=forecast_service.settings.targets, index=environment_df.index)],
        axis=1,
    )
    logger.info("Forecasting...")
    horizons, forecasts = forecast_service.forecast(req, environment_predictions_df)
    logger.info(f"Horizon length: {horizons}, Forecasts: {len(forecasts.keys())}")

    return ForecastResponse.build(environment_predictions_df, horizons, forecasts)



# @router.post(
#     "/interpret" ,
#     response_model= InterpretationResponse ,
#     summary="Interpret prediction results" ,
#     description=(
#         "Pass the LGBM prediction results for a country and receive a "
#         "plain-text human-readable interpretation powered by a Qwen model "
#         "hosted on Groq."
#     ),
# )


async def interpret_prediction(
    body: InterpretationRequest,
    agent_service: AgentService,
) -> InterpretationResponse:
    message = await agent_service.interpret(
        country=body.country,
        simulation_outcomes=body.simulation_outcomes,
        environmental_data=body.environmental_data,
    )
    return InterpretationResponse(message=message)



 