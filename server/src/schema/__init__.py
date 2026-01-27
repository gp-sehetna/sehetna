from pydantic import BaseModel, ConfigDict

from src.schema.predictions import (
    EnvironmentData,
    PredictionRequest,
    PredictionResult,
    SimulationResponse,
    WeeklyEnvironmentData,
)

__all__ = [
    "PredictionResult",
    "PredictionRequest",
    "SimulationResponse",
    "EnvironmentData",
    "WeeklyEnvironmentData",
    "RootResponse",
    "HealthCheckResponse",
]


class RootResponse(BaseModel):
    message: str
    version: str
    status: str
    description: str
    model_config = ConfigDict(extra="allow")
