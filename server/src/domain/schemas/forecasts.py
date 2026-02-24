import json
from typing import TypedDict

from pydantic import BaseModel, ConfigDict, Field

from src.domain.schemas.predictions import PredictionRequest

with open("src/domain/schemas/examples/forecast_request.json") as f:
    forecast_request_examples: dict = json.load(f)


class ForecastRequest(PredictionRequest):
    model_id: str = Field(..., description="Identifier for the prediction model to use.")

    model_config = ConfigDict(json_schema_extra={"examples": forecast_request_examples})


class TargetForecast(TypedDict):
    point: list[float]
    lower: list[float]
    upper: list[float]


type ForecastResult = dict[str, TargetForecast]


class ForecastResponse(BaseModel):
    """
    Response wrapper for forecast endpoints.

    Attributes:
        horizon: Prediction horizon in weeks.
        forecasts: Point and confidence interval forecasts.
    """

    horizon: int = Field(..., description="Prediction horizon in weeks.")
    forecasts: ForecastResult = Field(..., description="Point and confidence interval forecasts.")
