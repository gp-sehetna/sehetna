import joblib
import logging

logger = logging.getLogger(__name__)


class ModelLoader:
    def __init__(self):
        self.model = None
        self.pipeline = None
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

    def __call__(self, settings):
        try:
            self.load_model(settings.model_path)
            logger.info("Model loaded successfully")
        except Exception as e:
            logger.critical("Failed to load model", exc_info=e)
        try:
            self.load_pipeline(settings.pipeline_path)
            logger.info("Pipeline loaded successfully")
        except Exception as e:
            logger.critical("Failed to load Pipeline", exc_info=e)

    def load_model(self, path: str):
        self.model = joblib.load(path)
        logger.info(f"Loaded LightGBM model")

    def load_pipeline(self, path: str):
        self.pipeline = joblib.load(path)
        logger.info(f"Loaded pipeline")


# Global instance
model_loader = ModelLoader()
