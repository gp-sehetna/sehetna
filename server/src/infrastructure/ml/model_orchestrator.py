from typing import Protocol
import logging
logger = logging.getLogger(__name__)


class _Predictor(Protocol):
    """Protocol defining the interface for prediction models."""
    
    def predict(self, series: list[float], horizon: int) -> list[float]:
        """
        Generate predictions for a time series.
        
        Args:
            series: Time series data
            horizon: Number of steps to forecast
            
        Returns:
            List of predictions
        """
        ...



class ModelOrchestrator:
    """
    Orchestrates predictions from multiple time series models (TimesFM and PatchTST).
    Runs both models and aggregates their predictions.
    """
    
    def __init__(self, timesfm: _Predictor | None = None, patchtst: _Predictor | None = None):

        self.timesfm = timesfm
        self.patchtst = patchtst
        
        
        logger.info(f"ModelOrchestrator initialized with timesfm={timesfm is not None}, patchtst={patchtst is not None}")


    def run(self, series: list[float], horizon: int) -> dict[str, list[float]]:

        if self.timesfm is None or self.patchtst is None:
            raise ValueError("Both TimesFM and PatchTST models must be provided.")


        logger.info(f"Running orchestrator with series length: {len(series)}, horizon: {horizon}")

        results: dict[str, list[float]] = {}



        # Run TimesFM prediction
        logger.debug("Running TimesFM prediction...")
        timesfm_pred = self.timesfm.predict(series, horizon)

        results["timesfm"] = list(timesfm_pred)
        logger.debug(f"TimesFM predictions: {timesfm_pred}")

        # Run PatchTST prediction
        logger.debug("Running PatchTST prediction...")
        patchtst_pred = self.patchtst.predict(series, horizon)

        results["patchtst"] = list(patchtst_pred)

        logger.debug(f"PatchTST predictions: {patchtst_pred}")

        logger.info(f"Orchestrator completed. Results: {results}")

        return results
    
