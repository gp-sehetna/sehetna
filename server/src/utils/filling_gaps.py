import pandas as pd
import logging
from datetime import timedelta
from src.utils.sequential_utils import generate_future_dates
from src.domain.schemas.sequential_schemas import HistoricalData , WeeklyPrediction

logger = logging.getLogger(__name__)

def fill_gaps(
        original_df: pd.DataFrame,
        last_test_date,
        today_date,
        lightgbm_model,
        lightgbm_pipeline,
        targets
)-> tuple[HistoricalData, pd.DataFrame]:
    """
    Fill historical gaps using LightGBM.
    
    Args:
        original_df: Original dataframe (up to last_test_date)
        last_test_date: Last date in test data
        today_date: Current date
    
    Returns:
        tuple: (HistoricalData, filled_predictions_df)
            - HistoricalData: For API response
            - filled_predictions_df: DataFrame with LightGBM predictions for combining
    """

    logger.info("Filling gaps with LightGBM...")

    # Generate dates for gap period
    start_date = last_test_date + timedelta(weeks=1)
    gap_dates = generate_future_dates(start_date, weeks_between(start_date, today_date))


    if len(gap_dates) == 0:
        logger.info("No gaps to fill - today is same as last test date")
        return HistoricalData(
            weeks=[],
            start_date=start_date,
            end_date=today_date,
            model_used="lightgbm"
        ), pd.DataFrame()
     
    logger.info(f"Filling {len(gap_dates)} weeks from {start_date} to {today_date}")


    # Create DataFrame for gap period with same structure as original
    gap_records = []
    for gap_date in gap_dates:
        # Copy last known values for features (or interpolate)
        last_record = original_df.iloc[-1].to_dict()
        last_record['date'] = gap_date
        gap_records.append(last_record)

    gap_df = pd.DataFrame(gap_records)
    gap_df['date'] = pd.to_datetime(gap_df['date'])
    gap_df['year'] = gap_df['date'].dt.year
    gap_df['month'] = gap_df['date'].dt.month
    gap_df['week'] = gap_df['date'].dt.isocalendar().week

     # Preprocess with LightGBM pipeline
    gap_processed = lightgbm_pipeline.transform(gap_df)

    # Predict with LightGBM
    predictions = lightgbm_model.predict(gap_processed)


    # Create DataFrame with predictions
    filled_df = gap_df.copy()
    for i, target in enumerate(targets):
        filled_df[target] = predictions[:, i]
    
    # Create HistoricalData for API response
    weeks = []
    for i, row in filled_df.iterrows():
        week_pred = WeeklyPrediction(
            date=row['date'].date(),
            respiratory_disease_rate=float(predictions[i, 0]),
            cardio_mortality_rate=float(predictions[i, 1]),
            vector_disease_risk_score=float(predictions[i, 2]),
            waterborne_disease_incidents=int(round(predictions[i, 3])),
            heat_related_admissions=int(round(predictions[i, 4]))
        )
        weeks.append(week_pred)

    
    historical_data = HistoricalData(
        weeks=weeks,
        start_date=start_date,
        end_date=today_date,
        model_used="lightgbm"
    )


    return historical_data, filled_df



def weeks_between(start_date, end_date):
    """Calculate number of weeks between two dates."""
    delta = end_date - start_date
    return max(0, delta.days // 7)


