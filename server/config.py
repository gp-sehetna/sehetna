from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = "Sehetna App"
    VERSION: str = "1.0.0"
    HOST: str = "0.0.0.0"
    PORT: int = 8000

    # Paths
    MODEL_PATH: str = "./src/modeling/saved-models/[model-0o2w5wtd-v0]-lstm-model.pkl"
    PIPELINE_PATH: str = "./src/modeling/saved-models/feature_pipeline.joblib"
    Y_SCALER_PATH: str = "./src/modeling/saved-models/y_scaler.joblib"
    FEATURE_NAMES_PATH: str = "./src/modeling/saved-models/feature_names.joblib"
    
    # Model configuration
    SEQ_LEN: int = 24
    BATCH_SIZE: int = 128
    
    class Config:
        env_file = ".env"

settings = Settings()

