import logging
import os

import joblib
import pandas as pd
from sklearn.pipeline import Pipeline

from config import Settings

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
        self.country_map: pd.DataFrame = None
        self.uhc_df: pd.DataFrame = None
        self.food_access_df: pd.DataFrame = None
        self.food_stability_df: pd.DataFrame = None

    def __call__(self, settings: Settings):
        self.load_model(settings.model_path)
        self.load_country_to_id(settings.country_to_id_path)
        self.load_id_to_country(settings.id_to_country_path)
        self.load_pipeline(settings.pipeline_path)

    def load_country_to_id(self, path: str):
        self.countries_to_idx: dict[str, int] = joblib.load(path)
        logger.info("Loaded countries to index mapping")

    def load_id_to_country(self, path: str):
        self.idx_to_countries: dict[int, str] = joblib.load(path)
        logger.info("Loaded index to countries mapping")

    def load_model(self, path: str):
        self.model = joblib.load(path)
        logger.info("Loaded model")

    def load_pipeline(self, path: str):
        self.pipeline: Pipeline = joblib.load(path)
        logger.info("Loaded pipeline")

    def load_indicators(self, settings: Settings):
        """Load and cache indicator dataframes to avoid repeated I/O."""
        country_map = pd.read_csv(os.path.join(settings.resources_path, "iso3_codes_m49_mapping.csv"))

        uhc_df = pd.read_csv(
            os.path.join(settings.indicators_dir, "WHO_9A706FD_ALL_LATEST/9A706FD_ALL_LATEST.csv"),
            usecols=["DIM_GEO_CODE_M49", "DIM_TIME", "INDEX_N"],
        )

        food_access_df = pd.read_csv(
            os.path.join(settings.indicators_dir, "FAO_CAHD_7005/FAO_CAHD_7005.csv"),
            usecols=["REF_AREA", "TIME_PERIOD", "OBS_VALUE"],
        )

        food_stability_df = pd.read_csv(
            os.path.join(settings.indicators_dir, "FAO_FS_210091/FAO_FS_210091.csv"),
            usecols=["REF_AREA", "TIME_PERIOD", "OBS_VALUE"],
        )
        logger.info("Loaded and cached all indicator dataframes")

        return country_map, uhc_df, food_access_df, food_stability_df
