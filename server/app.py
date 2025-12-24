import logging
from fastapi import FastAPI , HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.schema.request_response import PredictionRequest, PredictionResponse
from app.models.model_loader import model_loader
from app.models.predictor import Predictor
from config import settings


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)    

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Load all artifacts
    logger.info("Loading ML artifacts...")
    try:
        model_loader.load_model(settings.MODEL_PATH)
        model_loader.load_preprocessing_pipeline(settings.PIPELINE_PATH)
        model_loader.load_y_scaler(settings.Y_SCALER_PATH)
        model_loader.load_feature_names(settings.FEATURE_NAMES_PATH)
        logger.info("All artifacts loaded successfully")
    except Exception as e:
        logger.error(f"Error loading artifacts: {e}")
        raise
    
    yield
    
    logger.info("Shutting down...")

fast_app = FastAPI(
    title=settings.APP_NAME,
    version=settings.VERSION,
    lifespan=lifespan
)

fast_app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@fast_app.get("/")
async def root():
    return {
        "message": "Climate Health Prediction Service",
        "version": settings.VERSION,
        "status": "running"
    } 

@fast_app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "model_loaded": model_loader.get_model() is not None,
        "pipeline_loaded": model_loader.get_pipeline() is not None
    }


@fast_app.post("/predict", response_model=PredictionResponse)
async def predict(request: PredictionRequest):
    """
    Make health outcome predictions based on climate and health data.
    Requires sequential data (minimum seq_len records) for the specified country.
    """
    try:
        result = Predictor.predict(
            data=request.data,
            country_id=request.country_id,
            seq_len=settings.SEQ_LEN
        )
        
        return PredictionResponse(**result)

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Prediction error: {e}")
        raise HTTPException(status_code=500, detail=str(e))



@fast_app.get("/info")
async def model_info():
    """Get information about the model configuration"""
    return {
        "seq_len": settings.SEQ_LEN,
        "batch_size": settings.BATCH_SIZE,
        "device": str(model_loader.get_device()),
        "targets": [
            "respiratory_disease_rate",
            "cardio_mortality_rate",
            "vector_disease_risk_score",
            "waterborne_disease_incidents",
            "heat_related_admissions"
        ]
    }




