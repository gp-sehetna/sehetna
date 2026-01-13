from pydantic import BaseModel, Field
from typing import Annotated
from datetime import date

__all__ = ["PredictionResult", "PredictionRequest", "SimulationResponse", "HealthDataInput"]

# class SetupSimulateInputs(BaseModel):
#     """Validate Date in a specific window"""
#     date: Annotated[date, Field(description="Date in YYYY-MM-DD format")]
#     country_code: str | None = None
#     latitude: float | None = None
#     longitude: float | None = None

#     """Validate input should have country_code or (longitude and latitude) together"""
#     @model_validator(mode="after")
#     def check_location_info(cls, model):
#         if model.country_code is None:
#             if model.latitude is None or model.longitude is None:
#                 raise ValueError("Either country_code or both latitude and longitude must be provided.")
#         return model


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


class PredictionResult(BaseModel):
    respiratory_disease_rate: float
    cardio_mortality_rate: float
    vector_disease_risk_score: float
    waterborne_disease_incidents: float
    heat_related_admissions: float


class SimulationResponse(BaseModel):
    predictions: PredictionResult = Field(..., description="Predicted health outcomes")
