import pandas as pd
import numpy as np
from typing import Dict
import logging

from .model_loader import model_loader
from ..utils.feature_computer import FeatureComputer
from ..schema.request_response import HealthDataInput , PredictionResult


logger = logging.getLogger(__name__)

class Predictor:
    @staticmethod
    def predict(user_input: HealthDataInput) -> Dict:
        try:
            # Convert Pydantic model to dict
            input_dict = user_input.dict()

             # Compute all features
            df_complete = FeatureComputer.compute_all_features(input_dict)
            
            logger.info(f"Computed features: {df_complete.shape}")

            # Apply preprocessing pipeline
            pipeline = model_loader.get_pipeline()
            
            # Add dummy target columns (required by pipeline)
            targets = model_loader.get_targets()
            for target in targets:
                df_complete[target] = 0.0

            # Transform
            df_processed = pipeline.transform(df_complete)
            
            logger.info(f"After pipeline: {df_processed.shape}")
            
            # Get required features for model
            # The model expects specific features based on training
            # Extract them from processed dataframe
            model = model_loader.get_model()

            # Get feature names expected by model (from first estimator)
            try:
                expected_features = model.estimators_[0].feature_name_
            except:
                # If feature names not available, use all numeric columns
                expected_features = df_processed.select_dtypes(include=[np.number]).columns.tolist()


            # Ensure all expected features exist
            X_pred = df_processed[expected_features] if all(f in df_processed.columns for f in expected_features) else df_processed.select_dtypes(include=[np.number])
            
            # Step 4: Make prediction
            predictions = model.predict(X_pred)
            
            # Extract predictions (single row)
            pred_values = predictions[0]

            # Create result
            result = PredictionResult(
                respiratory_disease_rate=float(pred_values[0]),
                cardio_mortality_rate=float(pred_values[1]),
                vector_disease_risk_score=float(pred_values[2]),
                waterborne_disease_incidents=float(pred_values[3]),
                heat_related_admissions=float(pred_values[4])
            )

            # Prepare metadata
            lat, lon = FeatureComputer.get_coordinates(
                input_dict['country_code'],
                input_dict.get('latitude'),
                input_dict.get('longitude')
            )

            metadata = {
                "model_type": "LightGBM MultiOutputRegressor",
                "n_features": X_pred.shape[1],
                "coordinates_used": {"latitude": lat, "longitude": lon},
                "date_processed": str(input_dict['date'])
            }

            # Show some computed features
            computed_features = {
                "temp_squared": float(df_complete['temp_squared'].iloc[0]),
                "temp_anomaly_celsius": float(df_complete['temp_anomaly_celsius'].iloc[0]),
                "pollution_vulnerability": float(df_complete['pollution_vulnerability'].iloc[0]),
                "pm25_temp_interaction": float(df_complete['pm25_temp_interaction'].iloc[0]),
                "is_tropical": int(df_complete['is_tropical'].iloc[0]),
                "distance_to_equator": float(df_complete['distance_to_equator'].iloc[0]),
            }

            return {
                "country_code": input_dict['country_code'],
                "date": str(input_dict['date']),
                "predictions": result,
                "metadata": metadata,
                "computed_features": computed_features
            }

        

        except Exception as e:
            logger.error(f"Prediction error: {e}")
            raise