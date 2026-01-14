import logging
import os

import joblib
import pandas as pd
from sklearn.pipeline import Pipeline
from torch import nn

from src.config import Settings

logger = logging.getLogger(__name__)


class ModelLoader:
    def __init__(self):
        self.features = [
            "temp_squared",
            "pm25_ugm3",
            "heat_wave_days",
            "month_sin",
            "temp_precip_interaction",
            "aqi_pm",
            "temp_anomaly_celsius",
            "pollution_vulnerability",
            "flood_indicator",
            "healthcare_access_index",
            "distance_to_equator",
            "pm25_change_rate",
            "pm25_ugm3_lag_1w",
            "month_cos",
            "temp_change_rate",
            "temperature_celsius",
            "gdp_per_capita_usd",
            "quarter",
            "spatial_lag_pm25",
            "is_northern",
            "is_tropical",
            "spatial_lag_temp",
            "food_security_index",
        ]
        self.targets = [
            "respiratory_disease_rate",
            "cardio_mortality_rate",
            "vector_disease_risk_score",
            "waterborne_disease_incidents",
            "heat_related_admissions",
        ]

    def __call__(self, settings: Settings):
        self.load_model(settings.model_path)
        self.load_country_to_id(settings.country_to_id_path)
        self.load_id_to_country(settings.id_to_country_path)
        self.load_pipeline(settings.pipeline_path)

        data_df = pd.read_csv(os.path.join(settings.data_path, "25_countries_main.csv"))
        data_df["country_id"] = data_df["country_name"].map(self.countries_to_idx)
        self.fit_pipeline(data_df)

    def load_country_to_id(self, path: str):
        self.countries_to_idx = joblib.load(path)
        logger.info("Loaded countries to index mapping")

    def load_id_to_country(self, path: str):
        self.idx_to_countries = joblib.load(path)
        logger.info("Loaded index to countries mapping")

    def load_model(self, path: str):
        self.model: nn.Module = joblib.load(path)
        logger.info("Loaded model")

    def load_pipeline(self, path: str):
        self.pipeline: Pipeline = joblib.load(path)
        logger.info("Loaded pipeline")

    def fit_pipeline(self, data_df: pd.DataFrame):
        self.pipeline.fit(data_df)
        logger.info("Fitted pipeline")
