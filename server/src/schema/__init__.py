from pydantic import BaseModel
from .predictions import PredictionResult, PredictionRequest, SimulationResponse, HealthDataInput

__all__ = ["PredictionResult", "PredictionRequest", "SimulationResponse", "HealthDataInput", "RootResponse", "HealthCheckResponse"]


class RootResponse(BaseModel):
    message: str
    version: str
    status: str
    description: str


class HealthCheckResponse(BaseModel):
    status: str
    model_loaded: bool
    pipeline_loaded: bool
