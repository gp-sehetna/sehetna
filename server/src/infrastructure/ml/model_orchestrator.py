from typing import Protocol
import logging
import pandas as pd
logger = logging.getLogger(__name__)


class _Predictor(Protocol):
    """Protocol defining the interface for prediction models."""
    
    def predict(self, df: pd.DataFrame) -> tuple[list[float], list[float] | None]:
        """
        Generate predictions for a dataframe.
        
        Args:
            df: DataFrame with preprocessed data
            
        Returns:
            tuple: (predictions, uncertainty)
                - predictions: List of predictions (5 health outcomes)
                - uncertainty: List of standard deviations (None if not available)
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


    def run(self, df: pd.DataFrame) -> tuple[dict[str, list[float]], dict[str, list[float]]]:

        """
        Run predictions from both models.
        
        Args:
            df: DataFrame with preprocessed climate-health data
            
        Returns:
            tuple: (predictions, uncertainty)
                - predictions: Dictionary mapping model names to their predictions
                    Example: {
                        'timesfm': [12.5, 8.3, 0.45, 15.0, 23.0],
                        'patchtst': [11.8, 7.9, 0.42, 14.0, 22.0]
                    }
                - uncertainty: Dictionary mapping model names to their std deviations
                    Example: {
                        'patchtst': [0.5, 0.3, 0.02, 1.0, 2.0]
                    }
            
        Raises:
            ValueError: If either model is not initialized
        """


        if self.timesfm is None or self.patchtst is None:
            raise ValueError("Both TimesFM and PatchTST models must be provided.")


        logger.info(f"Running orchestrator with dataframe shape: {df.shape}")


        predictions: dict[str, list[float]] = {}
        uncertainty: dict[str, list[float]] = {}



        # Run TimesFM prediction
        logger.debug("Running TimesFM prediction...")
        timesfm_pred, timesfm_std = self.timesfm.predict(df)
        predictions["timesfm"] = list(timesfm_pred)

        if timesfm_std is not None:
            uncertainty["timesfm"] = list(timesfm_std)
        logger.debug(f"TimesFM predictions: {timesfm_pred}")


        # Run PatchTST prediction
        logger.debug("Running PatchTST prediction...")
        patchtst_pred, patchtst_std = self.patchtst.predict(df)
        predictions["patchtst"] = list(patchtst_pred)

        if patchtst_std is not None:
            uncertainty["patchtst"] = list(patchtst_std)
            logger.debug(f"PatchTST predictions: {patchtst_pred}, std: {patchtst_std}")
        else:
            logger.debug(f"PatchTST predictions: {patchtst_pred}")


        logger.info(f"Orchestrator completed.")
        logger.info(f"Predictions: {predictions}")
        logger.info(f"Uncertainty: {uncertainty}")

        return predictions , uncertainty
    
