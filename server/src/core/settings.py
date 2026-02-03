import os

from dotenv import load_dotenv

from config import DevelopmentSettings, ProductionSettings, Settings


def get_settings() -> Settings:
    environments: dict[str, type[Settings]] = {
        "development": DevelopmentSettings,
        "production": ProductionSettings,
    }
    state = os.environ.get("ENV_STATE", "development")
    EnvironmentSettings = environments.get(state, DevelopmentSettings)
    return EnvironmentSettings()


load_dotenv()

settings = get_settings()
