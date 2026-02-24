import logging
import os

import pandas as pd

from config import Settings
from src.core.exceptions import BadRequest

logger = logging.getLogger(__name__)


class HistoricalRepository:
    def __init__(self, settings: Settings):
        self.settings = settings
        self.df: pd.DataFrame | None = None
        self._historical_df: pd.DataFrame | None = None

    def load_all(self):
        self.df = pd.read_csv(os.path.join(self.settings.data_path, "main.csv"), parse_dates=["date"])

    def get_indicators(self, country_code: str) -> pd.DataFrame:
        if self.df is None or self.df.empty:
            self.load_all()

        return self.__filter_by_country_code(self.df, country_code)[self.settings.targets]

    def __filter_by_country_code(self, df: pd.DataFrame, country_code: str):
        if country_code not in df["country_code"].unique():
            raise BadRequest(f"Country code {country_code} not found in data. Please try a different country or model.")
        return df[df["country_code"] == country_code].reset_index(drop=True)
