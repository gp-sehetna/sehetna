from datetime import date
from pydantic import BaseModel, Field
from src.domain.schemas.predictions import PredictionRequest
class WeeklyPrediction(BaseModel):
    """Single week prediction with uncertainty bounds."""
    
    date: date = Field(..., description="Week date")
    respiratory_disease_rate: float
    cardio_mortality_rate: float
    vector_disease_risk_score: float
    waterborne_disease_incidents: int
    heat_related_admissions: int


class HistoricalData(BaseModel):
    """Historical data filled by LightGBM (higher priority)."""
    
    weeks: list[WeeklyPrediction] = Field(
        ..., 
        description="Weekly predictions from LightGBM filling gaps from last test data to today"
    )
    start_date: date = Field(..., description="Start date of historical predictions")
    end_date: date = Field(..., description="End date of historical predictions (today)")
    model_used: str = Field(default="lightgbm", description="Model used for historical data")


class SequentialPredictionRequest(BaseModel):
    """
    Request for sequential prediction with model selection.
    """
    
    # Base prediction data
    request: PredictionRequest = Field(
        ..., 
        description="Base prediction request with environmental data"
    )
    
    # Model selection
    model_id: str = Field(
        ..., 
        description="Model ID to use for forecasting (patchtst, timesfm, lstm, etc)"
    )
    
    # Date configuration
    last_test_date: date = Field(
        ..., 
        description="Last date in test data (e.g., 2025-10-01)"
    )
    
    today_date: date = Field(
        ..., 
        description="Current date (e.g., 2026-02-12)"
    )
    
    # Optional parameters
    forecast_horizon: int = Field(
        default=6, 
        description="Number of weeks to forecast into the future"
    )

    confidence_level: float = Field(
        default=0.95, 
        description="Confidence level for intervals (e.g., 0.95 for 95% CI)"
    )

class WeeklyPredictionWithCI(BaseModel):
    """Single week prediction with confidence intervals."""
    
    date: date = Field(..., description="Week date")
    
    # Mean predictions
    respiratory_disease_rate: float
    cardio_mortality_rate: float
    vector_disease_risk_score: float
    waterborne_disease_incidents: int
    heat_related_admissions: int
    
    # Confidence intervals
    respiratory_disease_rate_lower: float
    respiratory_disease_rate_upper: float
    cardio_mortality_rate_lower: float
    cardio_mortality_rate_upper: float
    vector_disease_risk_score_lower: float
    vector_disease_risk_score_upper: float
    waterborne_disease_incidents_lower: float
    waterborne_disease_incidents_upper: float
    heat_related_admissions_lower: float
    heat_related_admissions_upper: float



class ForecastData(BaseModel):
    """Forecast data from sequential models (lower priority)."""
    
    weeks: list[WeeklyPredictionWithCI] = Field(
        ..., 
        description="Weekly forecasts for next 6 weeks with confidence intervals"
    )
    start_date: date = Field(..., description="Start date of forecast (tomorrow)")
    end_date: date = Field(..., description="End date of forecast (6 weeks from tomorrow)")
    model_used: str = Field(..., description="Model used for forecast (patchtst, timesfm, etc)")
    horizon: int = Field(default=6, description="Forecast horizon in weeks")

class SequentialPredictionResult(BaseModel):
    """
    Complete prediction result with both historical and forecast data.
    """
    
    historical: HistoricalData = Field(
        ..., 
        description="Historical predictions (LightGBM) - higher priority"
    )
    forecast: ForecastData = Field(
        ..., 
        description="Future forecasts (sequential model) - lower priority"
    )
    metadata: dict = Field(
        default_factory=dict,
        description="Additional metadata about the prediction"
    )

class SequentialForecastResponse(BaseModel):
    """Response wrapper for sequential forecast endpoint."""
    
    predictions: SequentialPredictionResult = Field(
        ..., 
        description="Complete prediction result with historical and forecast data"
    )