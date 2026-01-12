import pandas as pd

from typing import List , Dict
import logging
from .model_loader import model_loader
from ..schema.request_response import HealthDataInput


logger = logging.getLogger(__name__)

class Predictor:
    @staticmethod 
    def preprocess_input_data(d: HealthDataInput) -> pd.DataFrame:
        """Convert input data to DataFrame and apply preprocessing"""

        # Convert to DataFrame
        df = pd.DataFrame([d.__dict__])

        # Define target columns (not needed for prediction but required for pipeline)
        target_columns = [
            'respiratory_disease_rate',
            'cardio_mortality_rate',
            'vector_disease_risk_score',
            'waterborne_disease_incidents',
            'heat_related_admissions'
        ]

        # Add dummy targets if not present
        for col in target_columns:
            if col not in df.columns:
                df[col] = 0

        # Prepare features
        X = df.drop(columns=target_columns, errors='ignore')

        # Apply preprocessing pipeline
        X_processed = model_loader.pipeline.transform(X)

        # Fill any NaN values
        X_processed.fillna(-1, inplace=True)
        
        # Add back identifiers and targets
        X_processed['country_id'] = df['country_id'].values
        X_processed['date'] = pd.to_datetime(df['date'])
        
        
        return X_processed
    

    @staticmethod
    def predict(data: List[HealthDataInput], country_id: int, seq_len: int = 24) -> Dict:
        # Preprocess data
        df_processed = Predictor.preprocess_input_data(data)
        results = []

        metadata = {
            "seq_len": seq_len,
            "country_id": country_id,
            "prediction_date": df_processed['date'].max().strftime('%Y-%m-%d'),
            "device": str(model_loader.device)
        }

        return {
            "predictions": results,
            "metadata": metadata
        }
        
