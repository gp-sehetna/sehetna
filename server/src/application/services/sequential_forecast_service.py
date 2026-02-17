import logging
import pandas as pd
from datetime import timedelta
from src.domain.schemas.predictions import PredictionResult
from src.models.ForecastModelFactory import ForecastModelFactory
from src.utils.sequential_utils import  test_model , generate_future_dates
from src.domain.schemas.sequential_schemas import SequentialForecastResult , ForecastRequest , WeeklyPredictionWithCI , ForecastData
from src.domain.sequential_dataset import SequentialDataset

logger = logging.getLogger(__name__)

class SequentialForecastService:
    """
    
        1- call the factory
        
            2- load
        
                3- forecast
    
    """
    
    
    def forecast(self, req: ForecastRequest, predictions : list[PredictionResult]) -> str: # SequentialForecastResult
        
        """ call forecast method of the passd model """
        model_id = req.model_id
        model_class = ForecastModelFactory()
        
        model = model_class.getInstance(model_id)
        res = model.load()
        # model.forecast()
        
        return res


    def _forecast_with_sequential_model(
        self,
        complete_historical_df: pd.DataFrame,
        model_id: str,
        today_date,
        horizon: int,
        confidence_level: float
    ) -> ForecastData:
        """
        Forecast future using sequential model.
        
        IMPORTANT: Uses the COMPLETE historical data (original + LightGBM filled)
        as input to the sequential model.
        
        Args:
            complete_historical_df: Complete DataFrame with original + filled data
            model_id: Model ID to use (patchtst, timesfm)
            today_date: Current date
            horizon: Forecast horizon in weeks
            confidence_level: Confidence level for intervals
        
        Returns:
            ForecastData with weekly forecasts
        """

        # Get model components
        model = self.sequential_models[model_id]
        pipeline = self.sequential_pipelines[model_id]
        target_scaler = self.target_scalers[model_id]

        # Preprocess complete historical data with sequential model's pipeline
        processed_df = pipeline.transform(complete_historical_df)
        logger.info(f"Preprocessed data shape: {processed_df.shape}")


        # Extract and scale targets
        y_data = processed_df[self.targets].values.astype('float32')
        y_scaled = target_scaler.transform(y_data)

        logger.info(f"Target data shape: {y_data.shape}")
        logger.info(f"Creating sequences with seq_len=12, horizon={horizon}")

        # Create dataset
        dataset = SequentialDataset(
            y_data=y_scaled,
            seq_len=12,
            horizon_len=horizon
        )

        logger.info(f"Dataset created with {len(dataset)} samples")
        
        if len(dataset) == 0:
            raise ValueError("Dataset has no samples - need at least 12 weeks of data")
        
        # Get all samples as batch
        y_past_batch, _ = dataset.get_all_batched()
        logger.info(f"Batch shape: y_past={y_past_batch.shape}")


        # Run prediction
        collapsed_preds, (lower_bound, upper_bound) = test_model(
            model=model,
            y_past_batch=y_past_batch,
            target_scaler=target_scaler,
            device=self.device
        )

        # Convert to numpy
        collapsed_preds_np = collapsed_preds.numpy()  # [horizon, num_targets]
        lower_bound_np = lower_bound.numpy()
        upper_bound_np = upper_bound.numpy()

        logger.info(f"Predictions shape: {collapsed_preds_np.shape}")

                # Generate future dates
        start_date = today_date + timedelta(weeks=1)
        future_dates = generate_future_dates(start_date, horizon) 

        # Create weekly predictions with CI
        weeks = []
        for i, date in enumerate(future_dates):
            week_pred = WeeklyPredictionWithCI(
                date=date,
                respiratory_disease_rate=float(collapsed_preds_np[i, 0]),
                respiratory_disease_rate_lower=float(lower_bound_np[i, 0]),
                respiratory_disease_rate_upper=float(upper_bound_np[i, 0]),
                
                cardio_mortality_rate=float(collapsed_preds_np[i, 1]),
                cardio_mortality_rate_lower=float(lower_bound_np[i, 1]),
                cardio_mortality_rate_upper=float(upper_bound_np[i, 1]),
                
                vector_disease_risk_score=float(collapsed_preds_np[i, 2]),
                vector_disease_risk_score_lower=float(lower_bound_np[i, 2]),
                vector_disease_risk_score_upper=float(upper_bound_np[i, 2]),
                
                waterborne_disease_incidents=int(round(collapsed_preds_np[i, 3])),
                waterborne_disease_incidents_lower=float(lower_bound_np[i, 3]),
                waterborne_disease_incidents_upper=float(upper_bound_np[i, 3]),
                
                heat_related_admissions=int(round(collapsed_preds_np[i, 4])),
                heat_related_admissions_lower=float(lower_bound_np[i, 4]),
                heat_related_admissions_upper=float(upper_bound_np[i, 4])
            )
            weeks.append(week_pred)


            end_date = future_dates[-1]
        
            return ForecastData(
                weeks=weeks,
                start_date=start_date,
                end_date=end_date,
                model_used=model_id,
                horizon=horizon
            )