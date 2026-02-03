import os

import joblib
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.impute import KNNImputer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, OrdinalEncoder

from src.core.settings import settings
from src.infrastructure.ml.helpers.mixins import CountryIQRCapper, FeatureEngineerMixin

# Categorical features
categorical_ordinal = ["income_level"]
categorical_onehot = ["region"]

# Core numeric features
core_numeric_features = [
    "country_id",
    "temperature_celsius",
    "temp_anomaly_celsius",
    "pm25_ugm3",
    "precipitation_mm",
    "food_security_index",
    "population_millions",
    "air_quality_index",
    "aqi_pm",
    "gdp_per_capita_usd",
    "mental_health_index",
    "uhs_service_coverage_index",
]

# Engineered features
engineered_features = [
    # PM2.5 lags and changes
    "pm25_ugm3_lag_1w",
    "pm25_ugm3_lag_2w",
    "pm25_ugm3_lag_4w",
    "pm25_change_rate",
    # Temperature lags and volatility
    "temp_lag_1w",
    "temp_lag_2w",
    "temp_2w_volatility",
    "temp_4w_volatility",
    "temp_2w_avg",
    "temp_squared",
    "temp_change_rate",
    # Precipitation
    "precip_change_rate",
    # Interactions
    "pm25_temp_interaction",
    "pm25_precip_interaction",
    "temp_precip_interaction",
    "pollution_vulnerability",
]

# Geographic/spatial features
spatial_features = [
    "latitude",
    "longitude",
    "spatial_lag_pm25",
    "spatial_lag_temp",
    "spatial_lag_temp_anomaly",
    "is_northern",
    "is_tropical",
    "distance_to_equator",
]

# Environmental event indicators
event_features = ["heat_wave_days", "drought_indicator", "flood_indicator", "extreme_weather_events"]

# Temporal features
temporal_features = ["day_of_week", "quarter", "month_sin", "month_cos", "week_sin", "week_cos"]

# All numeric features that should be preprocessed
all_numeric_features = core_numeric_features + engineered_features + spatial_features + event_features + temporal_features


def main():
    numeric_pipeline = Pipeline(
        [
            ("capped", CountryIQRCapper()),
            ("knn_imputer", KNNImputer(n_neighbors=5)),
        ]
    )

    numeric_preprocessor = ColumnTransformer(
        transformers=[
            ("ordinal_categorical", OrdinalEncoder(handle_unknown="use_encoded_value", unknown_value=-1), categorical_ordinal),
            ("onehot_categorical", OneHotEncoder(handle_unknown="ignore", sparse_output=False), categorical_onehot),
            ("preprocessed", numeric_pipeline, all_numeric_features),
        ],
        verbose_feature_names_out=False,
        remainder="passthrough",
    )

    pipeline = Pipeline(
        [
            ("date_feature_engineer", FeatureEngineerMixin()),
            ("numeric_preprocessing", numeric_preprocessor),
        ]
    )

    archive_name = "[modelling_phase_v5]-multioutput_lgbm"

    countries_ids: dict[str, int] = joblib.load(os.path.join(settings.archive_dir, "shared", "country_to_id.joblib"))
    data_df: pd.DataFrame = pd.read_csv(os.path.join(settings.data_path, "25_countries_main.csv"), parse_dates=["date"])
    data_df["country_id"] = data_df["country_name"].map(countries_ids)
    pipeline.fit(data_df)

    joblib.dump(pipeline, os.path.join(settings.archive_dir, archive_name, "pipeline.joblib"))


if __name__ == "__main__":
    main()

# to run this script use: python -m src.infrastructure.ml.pipelines.lgbm
