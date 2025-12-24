from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = "Sehetna App"
    VERSION: str = "1.0.0"
    HOST: str = "0.0.0.0"
    PORT: int = 8000

    # Paths
    MODEL_PATH: str = "./src/modeling/saved-models/lstm.pkl"
    PIPELINE_PATH: str = "./src/modeling/saved-models/feature_pipeline.joblib"
    Y_SCALER_PATH: str = "./src/modeling/saved-models/y_scaler.joblib"
    FEATURE_NAMES_PATH: str = "./src/modeling/saved-models/feature_names.pkl"
    
    # Model configuration
    SEQ_LEN: int = 12  # Sequence length for temporal data
    BATCH_SIZE: int = 32
    
    class Config:
        env_file = ".env"

settings = Settings();

