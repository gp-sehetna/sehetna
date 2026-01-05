import logging
import os
from typing import Dict, Type
from pydantic import computed_field
from pydantic_settings import BaseSettings, SettingsConfigDict

class PathSettings(BaseSettings):
    # Paths
    MODEL_NAME: str = "[model-0o2w5wtd-v0]-lstm"
    ARCHIVE_DIR: str = ".src/models/archives"
    @computed_field
    @property
    def MODEL_PATH(self) -> str:
        return f"{self.ARCHIVE_DIR}/{self.MODEL_NAME}/model.pkl"
    @computed_field
    @property
    def PIPELINE_PATH(self) -> str:
        return f"{self.ARCHIVE_DIR}/{self.MODEL_NAME}/feature_pipeline.joblib"
    @computed_field
    @property
    def Y_SCALER_PATH(self) -> str:
        return f"{self.ARCHIVE_DIR}/{self.MODEL_NAME}/y_scaler.joblib"
    @computed_field
    @property
    def FEATURE_NAMES_PATH(self) -> str:
        return f"{self.ARCHIVE_DIR}/{self.MODEL_NAME}/feature_names.joblib"
    

class Settings(PathSettings):
    APP_NAME: str = "Sehetna App"
    VERSION: str = "1.0"
    HOST: str = "0.0.0.0"
    PORT: int = 5000
    log_level: int | str | None

    # Model configuration
    SEQ_LEN: int = 24
    BATCH_SIZE: int = 128
    
    model_config = SettingsConfigDict(env_file='.env')
    

class DevelopmentSettings(Settings):
    log_level: int | str = logging.DEBUG
    model_config = SettingsConfigDict(env_file='.env.development', frozen=True)

class ProductionSettings(Settings):
    log_level: int | str = logging.WARNING
    model_config = SettingsConfigDict(env_file='.env.production', frozen=True)

def get_settings():
    environments: Dict[str, Type[Settings]] = {"development": DevelopmentSettings, "production": ProductionSettings}
    state = os.environ.get("ENV_STATE", "development")
    EnvironmentSettings = environments.get(state, DevelopmentSettings)
    return EnvironmentSettings()

settings = get_settings()

