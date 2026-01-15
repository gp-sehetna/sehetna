import json
from datetime import date
from typing import Annotated

from pydantic import BaseModel, ConfigDict, Field

__all__ = ["PredictionResult", "PredictionRequest", "SimulationResponse", "HealthDataInput"]

with open("src/schema/examples/prediction_request.json") as f:
    prediction_request_examples = json.load(f)


class HealthDataInput(BaseModel):
    date: Annotated[date, Field(description="Date in YYYY-MM-DD format")]
    country_code: str | None = None
    longitude: float | None = None
    latitude: float | None = None

    gdp_per_capita_usd: float
    temperature_celsius: float
    pm25_ugm3: float
    precipitation_mm: float
    aqi_pm: float
    healthcare_access_index: float
    food_security_index: float

    heat_wave_days: int = 0
    flood_indicator: int = 0


class PredictionRequest(BaseModel):
    data: HealthDataInput = Field(
        ...,
        description="Feature input values for prediction.",
    )

    model_config = ConfigDict(json_schema_extra={"examples": prediction_request_examples})


class PredictionResult(BaseModel):
    respiratory_disease_rate: float
    cardio_mortality_rate: float
    vector_disease_risk_score: float
    waterborne_disease_incidents: int
    heat_related_admissions: int


class SimulationResponse(BaseModel):
    predictions: PredictionResult = Field(..., description="Predicted health outcomes")
