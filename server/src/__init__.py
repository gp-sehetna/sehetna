import os
from contextlib import asynccontextmanager

from fastapi import FastAPI

from src.config import DevelopmentSettings, ProductionSettings, Settings
from src.models import loader

__all__ = ["get_settings", "lifespan"]


@asynccontextmanager
async def lifespan(app: FastAPI):
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
