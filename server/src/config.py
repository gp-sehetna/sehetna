import logging
import os

from pydantic import computed_field
from pydantic_settings import BaseSettings, SettingsConfigDict


class _Settings(BaseSettings):
    APP_NAME: str = "Sehetna App"
    VERSION: str = "1.0"
    HOST: str = "0.0.0.0"
    PORT: int = 5000
    log_level: int | str | None

    # Model configuration
    SEQ_LEN: int = 8
    BATCH_SIZE: int = 128

    # Paths
    resources_path: str

    model_config = SettingsConfigDict(env_file=".env")


class Settings(_Settings):
    # Paths
    __archive_name: str = "[modelling_phase_v5]-lgbm_fold_ensemble"

    @computed_field
    @property
    def archive_dir(self) -> str:
        return os.path.join(self.resources_path, "archives")

    @computed_field
    @property
    def model_path(self) -> str:
        return os.path.join(self.archive_dir, self.__archive_name, "model.joblib")

    @computed_field
    @property
    def pipeline_path(self) -> str:
        return os.path.join(self.archive_dir, self.__archive_name, "pipeline.joblib")

    @computed_field
    @property
    def country_to_id_path(self) -> str:
        return os.path.join(self.archive_dir, "shared", "country_to_id.joblib")

    @computed_field
    @property
    def id_to_country_path(self) -> str:
        return os.path.join(self.archive_dir, "shared", "id_to_country.joblib")

    @computed_field
    @property
    def data_path(self) -> str:
        return os.path.join(self.resources_path, "data")


class DevelopmentSettings(Settings):
    log_level: int | str = logging.INFO
    model_config = SettingsConfigDict(env_file=".env.development", frozen=True)


class ProductionSettings(Settings):
    log_level: int | str = logging.WARNING
    model_config = SettingsConfigDict(env_file=".env.production", frozen=True)
