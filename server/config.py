import json
import logging
import os
from typing import Literal

import torch
from pydantic import computed_field
from pydantic_settings import BaseSettings, SettingsConfigDict


class CoreSettings(BaseSettings):
    # App info
    app_name: str = "Sehetna App"
    version: str = "1.0"
    env_state: Literal["development", "production"]
    log_level: int | str = "INFO"

    # Team info
    team_name: str = "Sehetna Team"
    team_email: str = "support@sehetna.from-masr.com"
    description: str = """\
Sehetna Services API
Provides health risk predictions based on climate data.\
"""

    # Paths
    resources_path: str
    device: torch.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

    model_config = SettingsConfigDict(env_file=".env")


class PathSettings(CoreSettings):
    # Paths
    __lgbm_archive: str = "[modelling_phase_v5]-multioutput_lgbm"
    __patchtst_archive: str = "[model-67ual6ug-v0]-patch-tst"

    @computed_field
    @property
    def configuration_dir(self) -> str:
        return os.path.join(self.resources_path, "configurations")

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
        return os.path.join(self.archive_dir, self.__lgbm_archive, "model.joblib")

    @computed_field
    @property
    def patchtst_model_path(self) -> str:
        return os.path.join(self.archive_dir, self.__patchtst_archive, "model.pkl")

    @computed_field
    @property
    def patchtst_pipeline_path(self) -> str:
        return os.path.join(self.archive_dir, self.__patchtst_archive, "pipeline.joblib")

    @computed_field
    @property
    def patchtst_scaler_path(self) -> str:
        return os.path.join(self.archive_dir, self.__patchtst_archive, "y_scaler.joblib")

    @computed_field
    @property
    def shap_background_data_path(self) -> str:
        return os.path.join(self.archive_dir, self.__lgbm_archive, "shap_background.joblib")

    @computed_field
    @property
    def pipeline_path(self) -> str:
        return os.path.join(self.archive_dir, self.__lgbm_archive, "pipeline.joblib")

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


class Settings(PathSettings):
    @computed_field
    @property
    def targets(self) -> list[str]:
        with open(os.path.join(self.configuration_dir, "targets.json")) as f:
            return json.load(f)

    @computed_field
    @property
    def features(self) -> list[str]:
        with open(os.path.join(self.configuration_dir, "features.json")) as f:
            return json.load(f)

    @computed_field
    @property
    def feature_groups(self) -> dict[str, list[str]]:
        with open(os.path.join(self.configuration_dir, "feature_groups.json")) as f:
            return json.load(f)


class DevelopmentSettings(Settings):
    log_level: int | str = logging.DEBUG
    model_config = SettingsConfigDict(env_file=".env.development", frozen=True)


class ProductionSettings(Settings):
    log_level: int | str = logging.WARNING
    model_config = SettingsConfigDict(env_file=".env.production", frozen=True)
