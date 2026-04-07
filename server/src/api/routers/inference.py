# from fastapi import APIRouter, Depends, Query
import logging
import time
from typing import Annotated

import pandas as pd
from fastapi import APIRouter, Depends, Query

from src.api.dependencies import get_agent_service, get_forecast_service, get_prediction_service
from src.application.services.agent_service import AgentService
from src.application.services.forecast_service import ForecastService
from src.application.services.prediction_service import PredictionService
from src.domain.schemas.forecasts import ForecastRequest, ForecastResponse
from src.domain.schemas.predictions import (
    PredictionQueryParams,
    PredictionRequest,
    PredictionResult,
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

    _t_start = time.perf_counter()
    interpretation_message = await agent_service.interpret(
        country=req.country_code,
        simulation_outcomes=PredictionResult.from_prediction(predictions[0]),
        environmental_data=environment_df.astype(str).to_dict(orient="records"),
    )
    _t_elapsed = time.perf_counter() - _t_start

    logger.info(f"Interpretation completed in {_t_elapsed:.2f} seconds")

    return SimulationResponse.build(
        predictions,
        query.explainer_method,
        explanations,
        interpretation_message,
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
