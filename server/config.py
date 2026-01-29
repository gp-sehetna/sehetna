import logging
import os
from typing import Literal

from pydantic import computed_field
from pydantic_settings import BaseSettings, SettingsConfigDict


class _Settings(BaseSettings):
    # App info
    app_name: str = "Sehetna App"
    version: str = "1.0"
    env_state: Literal["development", "production"]
    log_level: int | str | None

    # Team info
    team_name: str = "Sehetna Team"
    team_email: str = "dexter.kuhn63@gmail.com"
    description: str = """\
Sehetna Services API
Provides health risk predictions based on climate data.\
"""

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
    def indicators_dir(self) -> str:
        return os.path.join(self.data_path, "indicators")

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
