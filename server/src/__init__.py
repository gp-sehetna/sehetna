import os

from src.config import DevelopmentSettings, ProductionSettings, Settings


def get_settings():
    environments: dict[str, type[Settings]] = {
        "development": DevelopmentSettings,
        "production": ProductionSettings,
    }
    state = os.environ.get("ENV_STATE", "development")
    EnvironmentSettings = environments.get(state, DevelopmentSettings)
    return EnvironmentSettings()


settings = get_settings()
