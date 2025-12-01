"""
Process OpenAQ data to produce weekly aggregated statistics per location and parameter.
"""

import pandas as pd
import time
import os


def process_weekly_data(input_file, output_file):
    start_time = time.time()
    print(f"Processing {input_file}...")

    # 1. ROBUST READING STRATEGY
    try:
        print("Reading CSV (all columns as text to prevent type inference errors)...")
        df = pd.read_csv(input_file, low_memory=False, dtype=str)
    except ValueError as e:
        print(f"Error reading CSV: {e}")
        return

    initial_count = len(df)
    print(f"Rows loaded: {initial_count}")

    # --- CHANGE 2: Added 'country' to required columns ---
    required_cols = ["country", "location", "datetime", "parameter", "units", "value"]

    missing_cols = [c for c in required_cols if c not in df.columns]
    if missing_cols:
        print(f"CRITICAL ERROR: Missing columns: {missing_cols}")
        print(f"Available columns: {list(df.columns)}")
        return

    # 2. CLEANING & DIAGNOSTICS
    print("Converting 'value' to numeric...")
    df["value"] = df["value"].str.strip()
    df["value_numeric"] = pd.to_numeric(df["value"], errors="coerce")

    # Drop non-numeric rows
    df = df.dropna(subset=["value_numeric"])
    df["value"] = df["value_numeric"]
    del df["value_numeric"]

    # 3. DATE PARSING
    print("Parsing dates...")
    df["datetime"] = pd.to_datetime(df["datetime"], utc=True, errors="coerce")
    df_final = df.dropna(subset=["datetime"])

    if df_final.empty:
        print("CRITICAL: No valid data remaining.")
        return

    # 4. OPTIMIZATION: Categorical Types
    # Added "country" here to save memory
    for col in ["country", "location", "parameter", "units"]:
        df_final[col] = df_final[col].astype("category")

    print(f"Aggregating {len(df_final)} valid records to weekly...")

    # 5. AGGREGATION
    df_final.set_index("datetime", inplace=True)

    # --- CHANGE 3: Group by Country as well ---
    # We must group by country so it isn't lost during the resampling
    grouped = df_final.groupby(
        ["country", "location", "parameter", "units"], observed=True
    )

    weekly_df = grouped.resample("W")["value"].agg(["mean", "max", "min"]).reset_index()

    # Drop weeks with no data
    weekly_df.dropna(subset=["mean"], inplace=True)

    # 6. FORMATTING
    dt_props = weekly_df["datetime"].dt
    weekly_df["year"] = dt_props.year
    weekly_df["month"] = dt_props.month
    weekly_df["week"] = dt_props.isocalendar().week.astype(int)

    # Reorder columns to include country
    final_cols = [
        "year",
        "month",
        "week",
        "country",  # <--- New Column Position
        "location",
        "parameter",
        "units",
        "mean",
        "max",
        "min",
    ]
    weekly_df = weekly_df[final_cols]

    # Sort
    weekly_df.sort_values(
        by=["country", "location", "year", "week", "parameter"], inplace=True
    )

    # Round
    cols_to_round = ["mean", "max", "min"]
    weekly_df[cols_to_round] = weekly_df[cols_to_round].round(3)

    # 7. SAVE
    print(f"Saving {len(weekly_df)} weekly records to {output_file}...")
    weekly_df.to_csv(output_file, index=False)

    duration = time.time() - start_time
    print(f"Done! Processed in {duration:.2f}s.")


if __name__ == "__main__":
    input_csv = "25_countries_air.csv"
    # Renamed output file to reflect that it now contains all locations
    output_csv = "25_countries_air_weekly_agg.csv"

    if os.path.exists(input_csv):
        process_weekly_data(input_csv, output_csv)
    else:
        print(f"Input file '{input_csv}' not found.")
