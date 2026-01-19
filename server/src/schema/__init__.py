from pydantic import BaseModel, ConfigDict

from src.schema.predictions import HealthDataInput, PredictionRequest, PredictionResult, SimulationResponse

__all__ = [
    "PredictionResult",
    "PredictionRequest",
    "SimulationResponse",
    "HealthDataInput",
    "RootResponse",
    "HealthCheckResponse",
]


class RootResponse(BaseModel):
    message: str
    version: str
    status: str
    description: str
    model_config = ConfigDict(extra="allow")
