import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.neighbors import NearestNeighbors
from sklearn.base import BaseEstimator, TransformerMixin


class FeatureEngineerMixin(BaseEstimator, TransformerMixin):
    def fit(self, X, y=None):
        return self

    def transform(self, X):
        if not isinstance(X, pd.DataFrame):
            raise ValueError("X must be a pandas DataFrame")

        X_copy = X.copy()

        if "country_code" not in X_copy.columns:
            raise ValueError("country_code column is required for lag features")


        ### Error here... should fix when input length < k (move this block to fit method)
        coords = X_copy[["latitude", "longitude"]].values

        nbrs = NearestNeighbors(n_neighbors=5, algorithm="ball_tree").fit(coords)
        _, indices = nbrs.kneighbors(coords)

        neighbor_idx = indices[:, 1:]

        if "date" in X_copy.columns:
            X_copy["date"] = pd.to_datetime(X_copy["date"])

            X_copy["day_of_week"] = X_copy["date"].dt.dayofweek
            X_copy["quarter"] = X_copy["date"].dt.quarter

        if "month" in X_copy.columns:
            X_copy["month_sin"] = np.sin(2 * np.pi * X_copy["month"] / 12)
            X_copy["month_cos"] = np.cos(2 * np.pi * X_copy["month"] / 12)

        if "week" in X_copy.columns:
            X_copy["week_sin"] = np.sin(2 * np.pi * X_copy["week"] / 52)
            X_copy["week_cos"] = np.cos(2 * np.pi * X_copy["week"] / 52)

        if "pm25_ugm3" in X_copy.columns:
            X_copy["pm25_ugm3_lag_1w"] = X_copy.groupby("country_code")[
                "pm25_ugm3"
            ].shift(1)
            X_copy["pm25_ugm3_lag_2w"] = X_copy.groupby("country_code")[
                "pm25_ugm3"
            ].shift(2)
            X_copy["pm25_ugm3_lag_4w"] = X_copy.groupby("country_code")[
                "pm25_ugm3"
            ].shift(4)

            X_copy["pm25_change_rate"] = X_copy.groupby("country_code")[
                "pm25_ugm3"
            ].diff()

            X_copy["spatial_lag_pm25"] = (
                X_copy["pm25_ugm3"].values[neighbor_idx].mean(axis=1)
            )

        if "temperature_celsius" in X_copy.columns:
            X_copy["temp_lag_1w"] = X_copy.groupby("country_code")[
                "temperature_celsius"
            ].shift(1)
            X_copy["temp_lag_2w"] = X_copy.groupby("country_code")[
                "temperature_celsius"
            ].shift(2)

            X_copy["temp_2w_avg"] = X_copy.groupby("country_code")[
                "temperature_celsius"
            ].transform(lambda x: x.rolling(window=2, min_periods=1).mean())

            X_copy["temp_2w_volatility"] = X_copy.groupby("country_code")[
                "temperature_celsius"
            ].transform(lambda x: x.rolling(window=2, min_periods=1).std())

            X_copy["temp_4w_volatility"] = X_copy.groupby("country_code")[
                "temperature_celsius"
            ].transform(lambda x: x.rolling(window=4, min_periods=1).std())

            X_copy["temp_squared"] = X_copy["temperature_celsius"] ** 2

            X_copy["temp_change_rate"] = X_copy.groupby("country_code")[
                "temperature_celsius"
            ].diff()

            X_copy["spatial_lag_temp"] = (
                X_copy["temperature_celsius"].values[neighbor_idx].mean(axis=1)
            )

        if "precipitation_mm" in X_copy.columns:
            X_copy["precip_change_rate"] = X_copy.groupby("country_code")[
                "precipitation_mm"
            ].diff()

        if "temp_anomaly_celsius" in X_copy.columns:
            X_copy["spatial_lag_temp_anomaly"] = (
                X_copy["temp_anomaly_celsius"].values[neighbor_idx].mean(axis=1)
            )

        if "pm25_ugm3" in X_copy.columns and "temperature_celsius" in X_copy.columns:
            X_copy["pm25_temp_interaction"] = (
                X_copy["pm25_ugm3"] * X_copy["temperature_celsius"]
            )

        if (
            "temperature_celsius" in X_copy.columns
            and "precipitation_mm" in X_copy.columns
        ):
            X_copy["temp_precip_interaction"] = (
                X_copy["temperature_celsius"] * X_copy["precipitation_mm"]
            )

        if "pm25_ugm3" in X_copy.columns and "precipitation_mm" in X_copy.columns:
            X_copy["pm25_precip_interaction"] = (
                X_copy["pm25_ugm3"] * X_copy["precipitation_mm"]
            )

        X_copy["is_northern"] = (X_copy["latitude"] > 0).astype(int)
        X_copy["is_tropical"] = (X_copy["latitude"].abs() < 23.5).astype(int)
        X_copy["distance_to_equator"] = X_copy["latitude"].abs()

        if (
            "pm25_ugm3" in X_copy.columns
            and "healthcare_access_index" in X_copy.columns
        ):
            X_copy["pollution_vulnerability"] = X_copy["pm25_ugm3"] / (
                X_copy["healthcare_access_index"] + 1e-6
            )

        X_copy = X_copy.drop(columns=["month", "week"], errors="ignore")
        X_copy.fillna(X_copy.mean(numeric_only=True), inplace=True)

        self.feature_names_ = X_copy.columns.tolist()

        return X_copy

    def get_feature_names_out(self, input_features=None):
        if input_features is None:
            input_features = self.feature_names_
        return self.feature_names_


class CountryIQRCapper(BaseEstimator, TransformerMixin):
    def __init__(self, country_col="country_id", multiplier=1.5):
        self.country_col = country_col
        self.multiplier = multiplier

    def fit(self, X, y=None):
        self.feature_names_ = X.columns.tolist()
        self.bounds_ = {}

        for country in X[self.country_col].unique():
            mask = X[self.country_col] == country
            country_data = X.loc[mask, self.feature_names_]

            self.bounds_[country] = {}

            for col in self.feature_names_:
                if col == self.country_col:
                    continue

                series = country_data[col].dropna()

                if len(series) < 10:
                    self.bounds_[country][col] = (series.min(), series.max())
                    continue

                Q1 = series.quantile(0.25)
                Q3 = series.quantile(0.75)
                IQR = Q3 - Q1

                if IQR == 0:
                    self.bounds_[country][col] = (series.min(), series.max())
                    continue

                lower = Q1 - self.multiplier * IQR
                upper = Q3 + self.multiplier * IQR
                self.bounds_[country][col] = (lower, upper)

        return self

    def transform(self, X):
        if not hasattr(self, "bounds_"):
            raise ValueError("Capper has not been fitted yet. Call fit() first.")

        _X = X.copy()

        for country in _X[self.country_col].unique():
            mask = _X[self.country_col] == country

            if country not in self.bounds_:
                continue

            for col in self.feature_names_:
                if col == self.country_col:
                    continue

                lower, upper = self.bounds_[country][col]
                _X.loc[mask, col] = _X.loc[mask, col].clip(lower=lower, upper=upper)

        return _X

    def get_feature_names_out(self, input_features=None):
        if input_features is None:
            input_features = self.feature_names_
        return input_features


class SelectiveStandardScaler(BaseEstimator, TransformerMixin):
    def __init__(self, exclude_cols=None, drop_excluded=False):
        self.exclude_cols = exclude_cols or []
        self.drop_excluded = drop_excluded

    def fit(self, X, y=None):
        X = X.copy()

        self.scale_cols_ = [c for c in X.columns if c not in self.exclude_cols]

        self.scaler_ = StandardScaler()
        self.scaler_.fit(X[self.scale_cols_])

        self.feature_names_in_ = X.columns.tolist()
        self.feature_names_out_ = (
            self.scale_cols_ if self.drop_excluded else self.feature_names_in_
        )

        return self

    def transform(self, X):
        X_copy = X.copy()

        X_copy[self.scale_cols_] = X_copy[self.scale_cols_].astype("float64")
        X_copy.loc[:, self.scale_cols_] = self.scaler_.transform(
            X_copy[self.scale_cols_]
        )

        if self.drop_excluded:
            X_copy = X_copy[self.scale_cols_]

        return X_copy

    def get_feature_names_out(self, input_features=None):
        return np.array(self.feature_names_out_)
