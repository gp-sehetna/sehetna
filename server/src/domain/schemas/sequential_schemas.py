from datetime import date as Date

from pydantic import BaseModel, Field

from src.domain.schemas.predictions import PredictionRequest


class WeeklyPrediction(BaseModel):
    """Single week prediction with uncertainty bounds."""
    
    date: Date = Field(..., description="Week date")
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
    start_date: Date = Field(..., description="Start date of historical predictions")
    end_date: Date = Field(..., description="End date of historical predictions (today)")
    model_used: str = Field(default="lightgbm", description="Model used for historical data")


""" """

class ForecastRequest(PredictionRequest):
    model_id: str = Field(..., description="Identifier for the prediction model to use.")



class WeeklyForecast(BaseModel):

    # date: str

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
    """Forecast data from sequential models (lower priority)."""
    
    forecasts: list[WeeklyForecast] = Field(
        ..., 
        description="Weekly forecasts for next 6 weeks with confidence intervals"
    )
    # start_date: Date = Field(..., description="Start date of forecast (tomorrow)")
    # end_date: Date = Field(..., description="End date of forecast (6 weeks from tomorrow)")



# class SequentialForecastResult(BaseModel):
#     """
#     Complete prediction result with both historical and forecast data.
#     """
    
#     historical: HistoricalData = Field(
#         ..., 
#         description="Historical predictions (LightGBM) - higher priority"
#     )

#     forecast: ForecastData = Field(
#         ..., 
#         description="Future forecasts (sequential model) - lower priority"
#     )
    
#     metadata: dict = Field(
#         default_factory=dict,
#         description="Additional metadata about the prediction"
#     )

class SequentialForecastResponse(BaseModel):
    """Response wrapper for sequential forecast endpoint."""
    
    ...