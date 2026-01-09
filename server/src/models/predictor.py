import torch
import pandas as pd
import numpy as np

from torch.utils.data import DataLoader
from torch.cuda.amp import autocast
from typing import List , Dict
import logging
from .model_loader import model_loader
from .dataset import ClimateHealthDataset
from ..schema.request_response import HealthDataInput, PredictionResult


logger = logging.getLogger(__name__)

class Predictor:
    @staticmethod 
    def preprocess_input_data(data: List[HealthDataInput]) -> pd.DataFrame:
        """Convert input data to DataFrame and apply preprocessing"""

        # Convert to DataFrame
        df = pd.DataFrame([d.__dict__ for d in data])

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
    
        # Filter for specific country
        df_country = df_processed[df_processed['country_id'] == country_id]
        
        if len(df_country) < seq_len:
            raise ValueError(
                f"Insufficient data: need at least {seq_len} records, got {len(df_country)}"
            )
        
        # # Create dataset
        # dataset = ClimateHealthDataset(df_country, seq_len=seq_len, model_loader.country_to_idx , )

        # if len(dataset) == 0:
        #     raise ValueError("No valid sequences created from data")
            
        # # Create dataloader
        # dataloader = torch.utils.data.dataloader(dataset, batch_size=128)

        # # Make predictions
        # model_loader.model.eval()
        # all_preds = []

    
        # with torch.no_grad():
        #     for X_num, country_tensor, _ in dataloader:
        #         X_num = X_num.to(model_loader.device)
        #         country_tensor = country_tensor.to(model_loader.device)
                
        #         with autocast(model_loader.device.type):
        #             preds = model_loader.model(X_num, country_tensor)
                
        #         all_preds.append(preds.detach().cpu())
        
        # # Concatenate predictions
        # final_pred = torch.cat(all_preds, dim=0)

        # # Inverse transform predictions
        # pred_numpy = final_pred.numpy()
        # pred_original_scale = model_loader.y_scaler.inverse_transform(pred_numpy)

        # # Get the last prediction (most recent)
        # last_prediction = pred_original_scale[-1]    

        # # Create result
        result = PredictionResult(
            respiratory_disease_rate=float(0),
            cardio_mortality_rate=float(0),
            vector_disease_risk_score=float(0),
            waterborne_disease_incidents=float(0),
            heat_related_admissions=float(0)
        )

        metadata = {
            "num_sequences": 500,
            "seq_len": seq_len,
            "country_id": country_id,
            "prediction_date": df_country['date'].max().strftime('%Y-%m-%d'),
            "device": str(model_loader.device)
        }

        return {
            "predictions": result,
            "metadata": metadata
        }
        
