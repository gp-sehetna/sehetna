from pydantic import BaseModel , Field
from typing import List , Optional , Dict , Any
from datetime import date


class HealthDataInput(BaseModel):
    date: str = Field(..., description="Date in YYYY-MM-DD format")
    country_code: str
    country_name: str
    country_id: int
    region: str
    income_level: str
    population_millions: float
    gdp_per_capita_usd: float
    latitude: float
    longitude: float
    
    # Health indices
    healthcare_access_index: float
    mental_health_index: float
    food_security_index: float
    uhs_service_coverage_index: Optional[float] = None
    
    # Environmental data
    pm25_ugm3: float
    air_quality_index: float
    aqi_pm: float
    temperature_celsius: float
    temp_anomaly_celsius: float
    precipitation_mm: float
    
    # Weather indicators
    heat_wave_days: int = 0
    drought_indicator: int = 0
    flood_indicator: int = 0
    extreme_weather_events: int = 0

class PredictionRequest(BaseModel):
    data: List[HealthDataInput] = Field(
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

class PredictionResponse(BaseModel):
    predictions: PredictionResult
    metadata: Dict[str, Any]

    
