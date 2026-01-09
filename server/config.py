import logging
import os
from typing import Dict, Type
from pydantic import computed_field
from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

class PathSettings(BaseSettings):
    # Paths
    ARCHIVE_DIR: str = os.path.join(BASE_DIR, "src/models/archives")
    MODEL_NAME: str = "4.0V"
    # Base archive directory
    MODEL_FILE: str = "[model-nvefcg0z-v0]-patch-tst-model.pkl"
    @computed_field
    @property
    def MODEL_PATH(self) -> str:
        return os.path.join(self.ARCHIVE_DIR, self.MODEL_NAME, self.MODEL_FILE)

    @computed_field
    @property
    def PIPELINE_PATH(self) -> str:
        return os.path.join(self.ARCHIVE_DIR, self.MODEL_NAME, "feature_pipeline_abdo.joblib")

    @computed_field
    @property
    def Y_SCALER_PATH(self) -> str:
        return os.path.join(self.ARCHIVE_DIR, self.MODEL_NAME, "y_scaler.joblib")

    @computed_field
    @property
    def COUNTRY_TO_IDX_PATH(self) -> str:
        return os.path.join(self.ARCHIVE_DIR, self.MODEL_NAME, "country_to_idx.joblib")

    @computed_field
    @property
    def IDX_TO_COUNTRY_PATH(self) -> str:
        return os.path.join(self.ARCHIVE_DIR, self.MODEL_NAME, "idx_to_country.joblib")

class Settings(PathSettings):
    APP_NAME: str = "Sehetna App"
    VERSION: str = "1.0"
    HOST: str = "0.0.0.0"
    PORT: int = 5000
    log_level: int | str | None

    # Model configuration
    SEQ_LEN: int = 8
    BATCH_SIZE: int = 128

    model_config = SettingsConfigDict(env_file=".env")


class DevelopmentSettings(Settings):
    log_level: int | str = logging.INFO
    model_config = SettingsConfigDict(env_file=".env.development", frozen=True)


class ProductionSettings(Settings):
    log_level: int | str = logging.WARNING
    model_config = SettingsConfigDict(env_file=".env.production", frozen=True)


def get_settings():
    environments: Dict[str, Type[Settings]] = {
        "development": DevelopmentSettings,
        "production": ProductionSettings,
    }
    state = os.environ.get("ENV_STATE", "development")
    EnvironmentSettings = environments.get(state, DevelopmentSettings)
    return EnvironmentSettings()


settings = get_settings()
