import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.exception_handlers import request_validation_exception_handler
from fastapi.middleware.cors import CORSMiddleware
from fastapi_versioning import VersionedFastAPI

from src import settings
from src.modeling.helpers.mixins import *
from src.models import model_loader
from src.models.predictor import Predictor
from src.schema import (
    HealthCheckResponse,
    PredictionRequest,
    RootResponse,
    SimulationResponse,
)

logging.basicConfig(level=settings.log_level, force=True)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    import __main__

    __main__.FeatureEngineerMixin = FeatureEngineerMixin
    __main__.CountryIQRCapper = CountryIQRCapper
    __main__.SelectiveStandardScaler = SelectiveStandardScaler

    model_loader(settings)
    yield


app = FastAPI(title=settings.APP_NAME)


@app.exception_handler(Exception)
async def validation_exception_handler(request, exc):
    return await request_validation_exception_handler(request, exc)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return RootResponse(
        message="Climate Health Simulation API",
        version=settings.VERSION,
        status="running",
        description="Predict health outcomes with minimal climate data input",
    )


@app.get("/check", response_model=HealthCheckResponse)
async def health_check():
    return HealthCheckResponse(
        status=("healthy" if model_loader.model and model_loader.pipeline else "unhealthy"),
        model_loaded=model_loader.model is not None,
        pipeline_loaded=model_loader.pipeline is not None,
    )


@app.post("/simulate", response_model=SimulationResponse)
async def simulate(input_data: PredictionRequest):
    result = Predictor.simulate(input_data.data)
    return SimulationResponse(result)


app = VersionedFastAPI(
    app,
    version_format="{major}",
    prefix_format="/api/{major}",
    description="Sehetna Services API\nProvides health risk predictions based on climate data.",
    contact={"name": "Sehetna Team", "email": "mohamedhussien.asu@gmail.com"},
    version=settings.VERSION,
    lifespan=lifespan,
)

## To run the app use: fastapi dev "src\main.py" or fastapi dev "main.py"
