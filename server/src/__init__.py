import os
from contextlib import asynccontextmanager

from fastapi import FastAPI

from src.config import DevelopmentSettings, ProductionSettings, Settings
from src.models import loader
from src.models.helpers.mixins import *

__all__ = ["get_settings", "lifespan"]


@asynccontextmanager
async def lifespan(app: FastAPI):
    import __main__

    __main__.FeatureEngineerMixin = FeatureEngineerMixin
    __main__.CountryIQRCapper = CountryIQRCapper
    __main__.SelectiveStandardScaler = SelectiveStandardScaler

    loader(settings)
    yield


def get_settings():
    environments: dict[str, type[Settings]] = {
        "development": DevelopmentSettings,
        "production": ProductionSettings,
    }
    state = os.environ.get("ENV_STATE", "development")
    EnvironmentSettings = environments.get(state, DevelopmentSettings)
    return EnvironmentSettings()


settings = get_settings()
