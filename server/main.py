import logging
from fastapi import FastAPI , HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exception_handlers import request_validation_exception_handler
from contextlib import asynccontextmanager
from fastapi_versioning import VersionedFastAPI

from .src.schema.request_response import PredictionRequest , HealthCheckResponse , SimulationResponse
from .src.models.model_loader import model_loader
from .src.models.predictor import Predictor
from .config import settings


logging.basicConfig(level=settings.log_level, force=True)
logger = logging.getLogger(__name__)


# @asynccontextmanager
# async def lifespan(app: FastAPI):
#     logger.info("=== Starting FastAPI app ===")
#     try:
#         model_loader.load_model(settings.MODEL_PATH)
#         model_loader.load_pipeline(settings.PIPELINE_PATH)
#         logger.info("Model and pipeline loaded successfully")
#     except Exception as e:
#         logger.critical("Failed to load model/pipeline")
#     yield
#     logger.info("=== Shutting down FastAPI app ===")    

#     logger.info(f"Shutting down! {app.title}")
@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("=== Starting FastAPI app ===")
    try:
        model_loader.load_model(settings.MODEL_PATH)
        logger.info("Model loaded successfully")
    except Exception as e:
        logger.critical("Failed to load model")
    try:
        model_loader.load_pipeline(settings.PIPELINE_PATH)
        logger.info("Pipeline loaded successfully")
    except Exception as e:
        logger.critical("Failed to load Pipeline")
    yield
    logger.info("=== Shutting down FastAPI app ===")    

    logger.info(f"Shutting down! {app.title}")


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.VERSION,
    description="Simulate climate-health predictions with minimal input data",
    lifespan=lifespan
)

# app = VersionedFastAPI(
#     FastAPI(title=settings.APP_NAME),
#     version_format="{major}",
#     prefix_format="/api/{major}",
#     description="Sehetna Services API\nProvides health risk predictions based on climate data.",
#     contact={"name": "Sehetna Team", "email": "mohamedhussien.asu@gmail.com"},
#     version=settings.VERSION,
#     lifespan=lifespan,
# )

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
    return {
        "message": "Climate Health Simulation API",
        "version": settings.VERSION,
        "status": "running",
        "description": "Predict health outcomes with minimal climate data input"
    }




@app.get("/check", response_model=HealthCheckResponse)
async def health_check():
    return HealthCheckResponse(
        status="healthy",
        model_loaded=model_loader.get_model() is not None,
        pipeline_loaded=model_loader.get_pipeline() is not None
    )

@app.post("/simulate", response_model=SimulationResponse)
async def simulate(input_data: PredictionRequest):
    try:
        result = Predictor.predict(input_data)
        return SimulationResponse(**result)
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))



@app.get("/info")
async def model_info():
    """Get information about the model and required inputs"""
    return {
        "model_type": "LightGBM MultiOutputRegressor",
        "targets": model_loader.get_targets(),
        "required_inputs": {
            "date": "YYYY-MM-DD",
            "country_code": "3-letter country code (e.g., USA, CHN)",
            "latitude": "Optional - latitude coordinate",
            "longitude": "Optional - longitude coordinate",
            "temperature_celsius": "Temperature in Celsius",
            "pm25_ugm3": "PM2.5 concentration",
            "precipitation_mm": "Precipitation in mm",
            "aqi_pm": "Air Quality Index",
            "healthcare_access_index": "0-1 scale",
            "food_security_index": "0-1 scale",
            "gdp_per_capita_usd": "GDP per capita",
            "heat_wave_days": "Number of heat wave days (default 0)",
            "flood_indicator": "0 or 1 (default 0)"
        },
        "computed_features": [
            "temp_squared", "temp_anomaly_celsius", "temp_lags",
            "pm25_lags", "spatial_lags", "interactions",
            "temporal_features", "geographic_indicators"
        ]
    }


@app.get("/example")
async def get_example():
    """Get an example simulation request"""
    return {
        "date": "2024-01-15",
        "country_code": "USA",
        "latitude": 37.09,
        "longitude": -95.71,
        "temperature_celsius": 15.5,
        "pm25_ugm3": 8.5,
        "precipitation_mm": 50.0,
        "aqi_pm": 45.0,
        "healthcare_access_index": 0.85,
        "food_security_index": 0.90,
        "gdp_per_capita_usd": 63000,
        "heat_wave_days": 0,
        "flood_indicator": 0
    }


# @app.get("/model")
# async def check_model_configuration():
#     return {
#         "default_name": settings.archive_name,
#     }


## To run the app use: fastapi dev "server\main.py" or fastapi dev "main.py"
