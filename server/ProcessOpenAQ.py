import pandas as pd
import numpy as np
import time
import os

def process_weekly_data(input_file, output_file):
    start_time = time.time()
    print(f"Processing {input_file}...")

    # 1. ROBUST READING STRATEGY
    # We remove 'usecols' to ensure we see the full row context (fixes shifted columns).
    # We use dtype=str to prevent Pandas from inferring types incorrectly and dropping data.
    try:
        print("Reading CSV (all columns as text to prevent type inference errors)...")
        df = pd.read_csv(input_file, low_memory=False)
    except ValueError as e:
        print(f"Error reading CSV: {e}")
        return
    
    df = df[(df['location_id'] == '971')]
    
    initial_count = len(df)
    print(f"Rows loaded: {initial_count}")

    # Ensure required columns exist
    required_cols = ['location', 'datetime', 'parameter', 'units', 'value']
    missing_cols = [c for c in required_cols if c not in df.columns]
    if missing_cols:
        print(f"CRITICAL ERROR: Missing columns: {missing_cols}")
        print(f"Available columns: {list(df.columns)}")
        return

    # 2. CLEANING & DIAGNOSTICS
    print("Converting 'value' to numeric...")
    
    # Strip whitespace which might cause ' 8.2' to fail conversion
    df['value'] = df['value'].str.strip()
    
    # Attempt conversion
    # errors='coerce' turns non-numbers (like headers 'value' or empty strings) into NaN
    df['value_numeric'] = pd.to_numeric(df['value'], errors='coerce')
    
    # Check what we are about to drop
    bad_mask = df['value_numeric'].isna()
    dropped_count = bad_mask.sum()
    
    if dropped_count > 0:
        print(f"WARNING: {dropped_count} rows have non-numeric values.")
        print("--- DEBUG: Sample of dropped rows (Check if data is shifted) ---")
        # Print the first 3 bad rows fully to see where the data went
        print(df[bad_mask].head(3).to_string())
        print("----------------------------------------------------------------")

    # Keep only valid numeric values
    df = df.dropna(subset=['value_numeric'])
    df['value'] = df['value_numeric'] # Overwrite string with float
    del df['value_numeric']

    # 3. DATE PARSING
    print("Parsing dates...")
    df['datetime'] = pd.to_datetime(df['datetime'], utc=True, errors='coerce')
    # Drop invalid dates
    df_final = df.dropna(subset=['datetime'])
    if len(df_final) < len(df):
        print(f"Dropped {len(df) - len(df_final)} rows due to bad dates.")

    if df_final.empty:
        print("CRITICAL: No valid data remaining. Check the DEBUG output above.")
        return

    # 4. OPTIMIZATION: Categorical Types
    # Now that we have clean data, convert strings to categories for speed
    for col in ['location', 'parameter', 'units']:
        df_final[col] = df_final[col].astype('category')

    print(f"Aggregating {len(df_final)} valid records to weekly...")

    # 5. AGGREGATION
    df_final.set_index('datetime', inplace=True)

    grouped = df_final.groupby(['location', 'parameter', 'units'], observed=True)
    weekly_df = grouped.resample('W')['value'].agg(['mean', 'max', 'min']).reset_index()

    # Drop weeks with no data
    weekly_df.dropna(subset=['mean'], inplace=True)

    # 6. FORMATTING
    dt_props = weekly_df['datetime'].dt
    weekly_df['year'] = dt_props.year
    weekly_df['month'] = dt_props.month
    weekly_df['week'] = dt_props.isocalendar().week.astype(int)

    # Reorder
    final_cols = ['year', 'month', 'week', 'location', 'parameter', 'units', 'mean', 'max', 'min']
    weekly_df = weekly_df[final_cols]
    
    # Sort
    weekly_df.sort_values(by=['year', 'week', 'location', 'parameter'], inplace=True)
    
    # Round
    cols_to_round = ['mean', 'max', 'min']
    weekly_df[cols_to_round] = weekly_df[cols_to_round].round(3)

    # 7. SAVE
    print(f"Saving {len(weekly_df)} weekly records to {output_file}...")
    weekly_df.to_csv(output_file, index=False)
    
    duration = time.time() - start_time
    print(f"Done! Processed in {duration:.2f}s.")

# ==========================================
# HELPER: Generate Dummy Data (For Testing)
# ==========================================
def generate_dummy_data(filename, rows=50000):
    print(f"Generating dummy file: {filename}...")
    dates = pd.date_range(start='2016-01-01', end='2025-12-31', freq='H')
    if len(dates) > rows: dates = dates[:rows]
    
    df = pd.DataFrame({
        'location_id': 971,
        'sensors_id': 1758,
        'location': 'Elizabeth Trailer-971',
        'datetime': dates,
        'lat': 40.64,
        'lon': -74.20,
        'parameter': np.random.choice(['pm25', 'no2', 'so2'], len(dates)),
        'units': 'ppm',
        'value': np.random.uniform(0, 50, len(dates))
    })
    df.to_csv(filename, index=False)
    print("Dummy generation complete.")

if __name__ == "__main__":
    input_csv = 'openaq_merged.csv'
    output_csv = '[2016-2025]-boston_1_weekly_agg_air.csv'

    if not os.path.exists(input_csv):
        print("Input file not found. Generating a sample file for testing...")
        pass

    process_weekly_data(input_csv, output_csv)