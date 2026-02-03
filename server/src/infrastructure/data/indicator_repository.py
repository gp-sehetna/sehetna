import logging
import os

import pandas as pd

from src.core.settings import Settings

logger = logging.getLogger(__name__)


class IndicatorRepository:
    def __init__(self, settings: Settings):
        self.settings = settings
        self._country_map: pd.DataFrame | None = None
        self._uhc_df: pd.DataFrame | None = None
        self._food_access_df: pd.DataFrame | None = None
        self._food_stability_df: pd.DataFrame | None = None

    def load_all(self) -> None:
        self._country_map = pd.read_csv(os.path.join(self.settings.resources_path, "iso3_codes_m49_mapping.csv"))

        self._uhc_df = pd.read_csv(
            os.path.join(self.settings.indicators_dir, "WHO_9A706FD_ALL_LATEST/9A706FD_ALL_LATEST.csv"),
            usecols=["DIM_GEO_CODE_M49", "DIM_TIME", "INDEX_N"],
        )

        self._food_access_df = pd.read_csv(
            os.path.join(self.settings.indicators_dir, "FAO_CAHD_7005/FAO_CAHD_7005.csv"),
            usecols=["REF_AREA", "TIME_PERIOD", "OBS_VALUE"],
        )

        self._food_stability_df = pd.read_csv(
            os.path.join(self.settings.indicators_dir, "FAO_FS_210091/FAO_FS_210091.csv"),
            usecols=["REF_AREA", "TIME_PERIOD", "OBS_VALUE"],
        )
        logger.info("Loaded and cached all indicator dataframes")

    def get_indicators(self) -> tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame, pd.DataFrame]:
        if any(df is None for df in [self._country_map, self._uhc_df, self._food_access_df, self._food_stability_df]):
            self.load_all()
        return self._country_map, self._uhc_df, self._food_access_df, self._food_stability_df
