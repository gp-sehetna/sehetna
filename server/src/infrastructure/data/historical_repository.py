import logging
import os
import pandas as pd
from config import Settings
logger = logging.getLogger(__name__)

class HistoricalRepository:
    def __init__(self, settings: Settings):
        self.settings = settings
        self._historical_df: pd.DataFrame | None = None

    def load_all(self, country_code:str) -> None:
        logger.info(f"Loading historical data from {self.settings.resources_path}")
        path = os.path.join(self.settings.resources_path, "data", "main.csv")

        df = pd.read_csv(path, parse_dates=["date"])
        
        df = df[df["country_code"] == country_code]
        
        self._historical_df = df.reset_index(drop=True)


    def get_indicators(self, country_code: str) -> pd.DataFrame:
        if self._historical_df is None or self._historical_df.empty:
            self.load_all(country_code)

        return self._historical_df.copy()
