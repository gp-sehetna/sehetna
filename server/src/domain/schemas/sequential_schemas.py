import json

from pydantic import BaseModel, ConfigDict, Field

from src.domain.schemas.predictions import PredictionRequest

with open("src/domain/schemas/examples/forecast_request.json") as f:
    forecast_request_examples: dict = json.load(f)


class ForecastRequest(PredictionRequest):
    model_id: str = Field(..., description="Identifier for the prediction model to use.")

    model_config = ConfigDict(json_schema_extra={"examples": forecast_request_examples})


class WeeklyForecast(BaseModel):
    respiratory_disease_rate: float
    respiratory_disease_rate_lower: float
    respiratory_disease_rate_upper: float

    cardio_mortality_rate: float
    cardio_mortality_rate_lower: float
    cardio_mortality_rate_upper: float

    vector_disease_risk_score: float
    vector_disease_risk_score_lower: float
    vector_disease_risk_score_upper: float

    waterborne_disease_incidents: int
    waterborne_disease_incidents_lower: float
    waterborne_disease_incidents_upper: float

    heat_related_admissions: int
    heat_related_admissions_lower: float
    heat_related_admissions_upper: float


class ForecastResponse(BaseModel):
    """Forecast data from sequential models."""

    forecasts: list[WeeklyForecast] = Field(..., description="Weekly forecasts for next 6 weeks with confidence intervals")
