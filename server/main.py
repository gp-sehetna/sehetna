import logging
from fastapi import FastAPI
from fastapi.exception_handlers import request_validation_exception_handler
from contextlib import asynccontextmanager

from .src.schema.request_response import PredictionRequest, PredictionResponse
from .src.models.model_loader import model_loader
from .src.models.predictor import Predictor
from .config import settings
from fastapi_versioning import VersionedFastAPI


logging.basicConfig(level=settings.log_level)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    model_loader(settings)

    yield

    logger.debug("Shutting down...")


_app = FastAPI(
    title=settings.APP_NAME,
    description="Sehetna Services API\nProvides health risk predictions based on climate data.",
    contact={"name": "Sehetna Team", "email": "mohamedhussien.asu@gmail.com"},
    version=settings.VERSION,
    lifespan=lifespan,
)


@_app.exception_handler(Exception)
async def validation_exception_handler(request, exc):
    return await request_validation_exception_handler(request, exc)


@_app.get("/")
async def root():
    return {
        "message": "Sehetna Services API is running.",
        "app_name": settings.APP_NAME,
        "version": settings.VERSION,
        "status": "running...",
    }


@_app.get("/check")
async def health_check():
    return {
        "status": (
            "unhealthy"
            if model_loader.model is None or model_loader.pipeline is None
            else "healthy"
        ),
        "model_loaded": model_loader.model is not None,
        "pipeline_loaded": model_loader.pipeline is not None,
    }


@_app.post("/predict", response_model=PredictionResponse)
async def predict(request: PredictionRequest):
    result = Predictor.predict(
        data=request.data, country_id=request.country_id, seq_len=settings.SEQ_LEN
    )

    return PredictionResponse(**result)


@_app.get("/info")
async def model_info():
    """Get information about the model configuration"""
    return {
        "seq_len": settings.SEQ_LEN,
        "batch_size": settings.BATCH_SIZE,
        "device": str(model_loader.device),
        "targets": [
            "respiratory_disease_rate",
            "cardio_mortality_rate",
            "vector_disease_risk_score",
            "waterborne_disease_incidents",
            "heat_related_admissions",
        ],
    }
    
@_app.get("/model")
async def check_model_configuration():
    return {
        "default_name": settings.MODEL_NAME,
        "model": settings.MODEL_PATH,
        "pipeline": settings.PIPELINE_PATH,
        "y_scaler": settings.Y_SCALER_PATH,
        "feature_names": settings.FEATURE_NAMES_PATH,
    }


app = VersionedFastAPI(_app, version_format="{major}", prefix_format="/api/v{major}")

## To run the app use: fastapi dev "server\main.py" or fastapi dev "main.py"
