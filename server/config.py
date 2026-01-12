import logging
import os
from typing import Dict, Type
from pydantic import computed_field
from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

class PathSettings(BaseSettings):
    # Paths
    archive_dir: str = os.path.join(BASE_DIR, "src/models/archives")
    archive_name: str = "[modelling_phase_v5]-lgbm_fold_ensemble"
    # Base archive directory
    @computed_field
    @property
    def model_path(self) -> str:
        return os.path.join(self.archive_dir, self.archive_name, "model.joblib")

    @computed_field
    @property
    def pipeline_path(self) -> str:
        return os.path.join(self.archive_dir, self.archive_name, "pipeline.joblib")

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
