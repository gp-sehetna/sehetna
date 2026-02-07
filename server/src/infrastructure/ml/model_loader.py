import logging

import joblib
import pandas as pd
from sklearn.pipeline import Pipeline

from src.core.settings import Settings

logger = logging.getLogger(__name__)


class ModelLoader:
    def __init__(self, settings: Settings):
        self.settings = settings
        self.model = None
        self.pipeline: Pipeline | None = None
        self.countries_to_idx: dict[str, int] | None = None
        self.idx_to_countries: dict[int, str] | None = None
        self.shap_X_background: pd.DataFrame | None = None

    def load_all(self) -> None:
        self.load_model(self.settings.model_path)
        self.load_country_to_id(self.settings.country_to_id_path)
        self.load_id_to_country(self.settings.id_to_country_path)
        self.load_pipeline(self.settings.pipeline_path)
        self.load_shap_background_data(self.settings.shap_background_data_path)

    def load_country_to_id(self, path: str) -> None:
        self.countries_to_idx = joblib.load(path)
        logger.info("Loaded countries to index mapping")

    def load_id_to_country(self, path: str) -> None:
        self.idx_to_countries = joblib.load(path)
        logger.info("Loaded index to countries mapping")

    def load_model(self, path: str) -> None:
        self.model = joblib.load(path)
        logger.info("Loaded model")

    def load_pipeline(self, path: str) -> None:
        self.pipeline = joblib.load(path)
        logger.info("Loaded pipeline")

    def load_shap_background_data(self, path: str) -> None:
        self.shap_X_background = joblib.load(path)
        logger.info("Loaded shap background data")
