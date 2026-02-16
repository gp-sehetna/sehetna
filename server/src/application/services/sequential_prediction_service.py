import logging
import pandas as pd
from datetime import timedelta
from src.utils.filling_gaps import fill_gaps
from src.utils.sequential_utils import combine_data , test_model , generate_future_dates
from src.domain.schemas.sequential_schemas import SequentialPredictionResult , SequentialPredictionRequest , WeeklyPredictionWithCI , ForecastData
from src.domain.sequential_dataset import SequentialDataset

logger = logging.getLogger(__name__)

class SequentialPredictionService:
    """
    Sequential prediction service with workflow:
    
    1. LightGBM fills historical gaps (last_test_date → today_date)
    2. Sequential model uses COMPLETE data (original + LightGBM filled) 
       to forecast future (today_date → today_date + horizon)
    
    The LightGBM output becomes INPUT to the sequential model.
    """

    def __init__(
        self,
        sequential_models: dict,  # {model_id: model}
        sequential_pipelines: dict,  # {model_id: pipeline}
        target_scalers: dict,  # {model_id: scaler}
        device: str = 'cpu'
    ):
        
        """Initialize sequential prediction service."""
        self.sequential_models = sequential_models
        self.sequential_pipelines = sequential_pipelines
        self.target_scalers = target_scalers
        self.device = device


        # Target columns
        self.targets = [
            'respiratory_disease_rate',
            'cardio_mortality_rate',
            'vector_disease_risk_score',
            'waterborne_disease_incidents',
            'heat_related_admissions'
        ]


        logger.info(f"SequentialPredictionService initialized with models: {list(sequential_models.keys())}")

    
    def predict(self, req: SequentialPredictionRequest) -> SequentialPredictionResult:
        """
        Run sequential prediction workflow.
        
        Workflow:
        1. Prepare input DataFrame from request
        2. Fill gaps with LightGBM (last_test_date → today_date)
        3. Combine original data + LightGBM predictions = COMPLETE historical data
        4. Use COMPLETE historical data as input to sequential model
        5. Sequential model forecasts future (today_date → today_date + horizon)
        6. Return both historical (from LightGBM) and forecast (from sequential model)
        
        Args:
            req: Sequential prediction request
        
        Returns:
            SequentialPredictionResult
        """
        logger.info("Starting sequential prediction")
        logger.info(f"Model: {req.model_id}")
        logger.info(f"Last test date: {req.last_test_date}")
        logger.info(f"Today: {req.today_date}")
        logger.info(f"Forecast horizon: {req.forecast_horizon} weeks")


        # Validate model ID
        if req.model_id not in self.sequential_models:
            raise ValueError(
                f"Model '{req.model_id}' not found. "
                f"Available models: {list(self.sequential_models.keys())}"
            )
        
        # Step 1: Prepare input data
        original_df = self._request_to_dataframe(req.request)
        logger.info(f"Original data: {len(original_df)} weeks (up to {req.last_test_date})")


        # Step 2: Fill historical gaps with LightGBM
        historical_data, lightgbm_predictions_df = fill_gaps(
            original_df=original_df,
            last_test_date=req.last_test_date,
            today_date=req.today_date
        )


        logger.info(f"LightGBM filled {len(lightgbm_predictions_df)} weeks of gaps")

        # Step 3: Combine original + LightGBM filled = COMPLETE historical data
        complete_historical_df = combine_data(
            original_df=original_df,
            filled_df=lightgbm_predictions_df,
            last_test_date=req.last_test_date
        )

        logger.info(f"Complete historical data: {len(complete_historical_df)} weeks")

        
        # Step 4: Use COMPLETE historical data as input to sequential model
        forecasted_data = self._forecast_with_sequential_model(
            complete_historical_df=complete_historical_df,
            model_id=req.model_id,
            today_date=req.today_date,
            horizon=req.forecast_horizon,
            confidence_level=req.confidence_level
        )
        logger.info(f"Sequential model forecasted {len(forecasted_data.weeks)} weeks")

        # Step 5: Create result
        result = SequentialPredictionResult(
            historical=historical_data,
            forecast=forecasted_data,
            metadata={
                'model_id': req.model_id,
                'last_test_date': req.last_test_date.isoformat(),
                'today_date': req.today_date.isoformat(),
                'forecast_horizon': req.forecast_horizon,
                'confidence_level': req.confidence_level,
                'original_weeks': len(original_df),
                'filled_weeks': len(lightgbm_predictions_df),
                'total_historical_weeks': len(complete_historical_df),
                'forecast_weeks': len(forecasted_data.weeks)
            }
        )
        
        logger.info("Sequential prediction completed successfully")
        return result




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
        


