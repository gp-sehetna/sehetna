import logging
from fastapi import FastAPI , HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from src.schema.request_response import PredictionRequest, PredictionResponse
from src.models.model_loader import model_loader
from src.models.predictor import Predictor
from config import settings


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)    

@asynccontextmanager
async def lifespan(app: FastAPI):
    model_loader(settings)
    
    yield
    
    logger.info("Shutting down...")

app = FastAPI(title=settings.APP_NAME, version=settings.VERSION, lifespan=lifespan)

app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

@app.get("/")
async def root():
    return {
        "message": "Sehetna Services API is running.",
        "version": settings.VERSION,
        "status": "running"
    } 

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "model_loaded": model_loader.model is not None,
        "pipeline_loaded": model_loader.pipeline is not None
    }


@app.post("/predict", response_model=PredictionResponse)
async def predict(request: PredictionRequest):
    try:
        result = Predictor.predict(data=request.data, country_id=request.country_id, seq_len=settings.SEQ_LEN)
        
        return PredictionResponse(**result)

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Prediction error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/info")
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
            "heat_related_admissions"
        ]
    }




