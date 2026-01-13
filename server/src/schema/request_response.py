from pydantic import BaseModel, Field, model_validator
from typing import Annotated, List, Optional, Dict, Any
from datetime import date

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
    # MAIN FEATURES FROM EXTERNAL APIS
    date: Annotated[date, Field(description="Date in YYYY-MM-DD format")]
    country_code: str | None = None
    latitude: float | None = None
    
    gdp_per_capita_usd: float
    temperature_celsius: float # -> temp_squared, temp_anomaly_celsius
    pm25_ugm3: float
    precipitation_mm: float # not used but get temp_precip_interaction from it
    aqi_pm: float
    healthcare_access_index: float
    food_security_index: float
    
    heat_wave_days: int = 0
    flood_indicator: int = 0
    
    ### OLD FEATURES - commented out
    
    # date: str = Field(..., description="Date in YYYY-MM-DD format")
    # country_code: str
    # country_name: str
    # country_id: int
    # region: str
    # income_level: str
    # population_millions: float
    # gdp_per_capita_usd: float
    # latitude: float
    # longitude: float
    
    # # Health indices
    # healthcare_access_index: float
    # mental_health_index: float
    # food_security_index: float
    # uhs_service_coverage_index: Optional[float] = None
    
    # # Environmental data
    # pm25_ugm3: float
    # air_quality_index: float
    # aqi_pm: float
    # temperature_celsius: float
    # temp_anomaly_celsius: float
    # precipitation_mm: float
    
    # # Weather indicators
    # heat_wave_days: int = 0
    # drought_indicator: int = 0
    # flood_indicator: int = 0
    # extreme_weather_events: int = 0

class PredictionRequest(BaseModel):
    data: HealthDataInput = Field(
        ..., 
        description="Sequential health data (minimum seq_len records for same country)"
    )
    country_id: int = Field(..., description="Country ID for prediction")

class PredictionResult(BaseModel):
    respiratory_disease_rate: float
    cardio_mortality_rate: float
    vector_disease_risk_score: float
    waterborne_disease_incidents: float
    heat_related_admissions: float

class SimulationResponse(BaseModel):
    country_code: str
    date: str
    predictions: PredictionResult
    metadata: dict
    computed_features: dict  # Show what was computed

class HealthCheckResponse(BaseModel):
    status: str
    model_loaded: bool
    pipeline_loaded: bool

    
