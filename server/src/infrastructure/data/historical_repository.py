import os

import pandas as pd

from config import Settings


class HistoricalRepository:
    def __init__(self, settings: Settings):
        self.settings = settings
        self._historical_df: pd.DataFrame | None = None  # Kaggle dataset

    def load_all(self) -> None:
        self._historical_df = pd.read_csv(os.path.join(self.settings.resources_path, "historical.csv"))

    def get_indicators(self) -> pd.DataFrame:
        if self._historical_df is None:
            self.load_all()
        return self._historical_df
