import json
from typing import TypedDict

import pandas as pd
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
        environment: Environment data that includes both the environment and health indicators as a list of dictionaries.
    """

    horizon: int = Field(..., description="Prediction horizon in weeks.")
    forecasts: ForecastResult = Field(..., description="Point and confidence interval forecasts.")
    environment: list[dict] = Field(..., description="Environment data.")

    @classmethod
    def build(cls, environment_df: pd.DataFrame, horizon: int, forecasts: ForecastResult):
        return cls(
            horizon=horizon,
            forecasts=forecasts,
            environment=environment_df.to_dict(orient="records"),
        )
