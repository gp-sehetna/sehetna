import requests
import boto3
import gzip
import os
from tqdm import tqdm
from botocore.client import Config
from botocore import UNSIGNED
from datetime import datetime
import pandas as pd

# -------------------------
# CONFIGURATION
# -------------------------
API_KEY = "65e9fb48f54f1a36865d75b9246aabddecf6ed509fd30c4b067bb042d32ea03d"
BUCKET = "openaq-data-archive"
BASE_API_URL = "https://api.openaq.org/v3/locations"

# Output Configuration
OUTPUT_FILE = "./country_data/AirQuality_Combined.csv"
os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)

# 1. Target Indicators (Map generic name to allowed Parameter IDs)
TARGET_INDICATORS = {
    "co": [8, 4, 102],  # ppm, µg/m³, ppb
    "o3": [10, 3, 32],  # ppm, µg/m³, ppb
    "no2": [15, 5, 7],  # ppb, µg/m³, ppm
    "so2": [101, 6, 9],  # ppb, µg/m³, ppm
    "pm1": [19],  # Optional based on your list
    "pm4": [19844],  # Optional based on your list
}

# 2. Countries List (Egypt + Proxies)
# Note: IDs are examples based on common lookups. Verify IDs if script returns 0 locations.
countries = [
    {"id": 155, "code": "US", "name": "United States", "done": False},
    {"id": 1, "code": "ID", "name": "Indonesia", "done": False},
    {"id": 6, "code": "AR", "name": "Argentina", "done": False},
    {"id": 9, "code": "IN", "name": "India", "done": False},
    {"id": 10, "code": "CN", "name": "China", "done": False},
    {"id": 17, "code": "KE", "name": "Kenya", "done": False},
    {"id": 22, "code": "FR", "name": "France", "done": False},
    {"id": 37, "code": "ZA", "name": "South Africa", "done": False},
    {"id": 45, "code": "BR", "name": "Brazil", "done": False},
    {"id": 50, "code": "DE", "name": "Germany", "done": False},
    {"id": 56, "code": "VN", "name": "Vietnam", "done": False},
    {"id": 67, "code": "ES", "name": "Spain", "done": False},
    {"id": 79, "code": "GB", "name": "United Kingdom", "done": False},
    {"id": 91, "code": "IT", "name": "Italy", "done": False},
    {"id": 100, "code": "NG", "name": "Nigeria", "done": False},
    {"id": 109, "code": "PK", "name": "Pakistan", "done": False},
    {"id": 111, "code": "TH", "name": "Thailand", "done": False},
    {"id": 128, "code": "BD", "name": "Bangladesh", "done": False},
    {"id": 138, "code": "CO", "name": "Colombia", "done": False},
    {"id": 156, "code": "CA", "name": "Canada", "done": False},
    {"id": 157, "code": "MX", "name": "Mexico", "done": False},
    {"id": 162, "code": "EG", "name": "Egypt", "done": False},
    {"id": 177, "code": "AU", "name": "Australia", "done": False},
    {"id": 183, "code": "PH", "name": "Philippines", "done": False},
    {"id": 190, "code": "JP", "name": "Japan", "done": False},
]

# S3 Client
s3 = boto3.client(
    "s3", region_name="us-east-1", config=Config(signature_version=UNSIGNED)
)


# -------------------------------------------------------
# HELPER FUNCTIONS
# -------------------------------------------------------
def get_indicator_name(param_id):
    for name, ids in TARGET_INDICATORS.items():
        if param_id in ids:
            return name
    return None


def calculate_duration_days(start_str, end_str):
    if not start_str or not end_str:
        return 0
    try:
        # Handle "2016-03-06T20:00:00Z" -> Replace Z for Python < 3.11 compatibility
        d1 = datetime.fromisoformat(start_str.replace("Z", "+00:00"))
        d2 = datetime.fromisoformat(end_str.replace("Z", "+00:00"))
        return (d2 - d1).days
    except ValueError:
        return 0


# -------------------------------------------------------
# STEP 1: Get Metadata
# -------------------------------------------------------
def get_all_locations_metadata(country_id):
    url = f"{BASE_API_URL}?countries_id={country_id}&limit=1000"
    headers = {"X-API-Key": API_KEY}
    print(f"Fetching metadata for country_id={country_id} ...")

    try:
        res = requests.get(url, headers=headers).json()
        return res.get("results", [])
    except Exception as e:
        print(f"API Error: {e}")
        return []


# -------------------------------------------------------
# STEP 2: Logic to Filter & Sort (Station Duration)
# -------------------------------------------------------
def optimize_locations(locations):
    """
    Selects locations based on STATION DURATION (History Length).
    """
    analyzed_locations = []

    for loc in locations:
        # 1. Calculate Station Duration from Location Object
        start_str = {} if not loc["datetimeFirst"] else loc["datetimeFirst"].get("utc")
        end_str = {} if not loc["datetimeLast"] else loc["datetimeLast"].get("utc")

        station_duration = calculate_duration_days(start_str, end_str)

        # Skip short-lived stations (< 90 days)
        if station_duration < 90:
            continue

        found_indicators = {}
        sensors = loc.get("sensors", [])

        # 2. Identify what sensors this station has
        for sensor in sensors:
            p_id = sensor.get("parameter", {}).get("id")
            s_id = sensor.get("id")
            ind_name = get_indicator_name(p_id)

            if ind_name:
                # Store the Sensor ID (sid) for downloading later
                if ind_name not in found_indicators:
                    found_indicators[ind_name] = {"sid": s_id}

        # 3. Calculate Score: Duration * Breadth
        if found_indicators:
            score = station_duration * len(found_indicators)
            analyzed_locations.append(
                {
                    "loc_object": loc,
                    "offers": found_indicators,
                    "duration": station_duration,
                    "score": score,
                }
            )

    # 4. Sort by Score (Oldest + Most Complete first)
    analyzed_locations.sort(key=lambda x: x["score"], reverse=True)

    # 5. Greedy Selection
    needed_indicators = set(TARGET_INDICATORS.keys())
    final_selection = []

    # We want to keep finding locations until we cover all indicators
    # BUT we also want to grab the "best" location for each indicator.
    print(f"   > Needed Indicators: {needed_indicators}")
    for item in analyzed_locations:
        if not needed_indicators:
            break

        offered_keys = set(item["offers"].keys())
        useful_keys = offered_keys.intersection(needed_indicators)

        if useful_keys:
            sensors_to_fetch = []
            names_found = []

            for key in useful_keys:
                sid = item["offers"][key]["sid"]
                sensors_to_fetch.append(sid)

                years = round(item["duration"] / 365, 1)
                names_found.append(f"{key} [{years}y]")

            final_selection.append(
                {
                    "id": item["loc_object"]["id"],
                    "name": item["loc_object"]["name"],
                    "fetch_sensor_ids": sensors_to_fetch,
                    "fetch_names": names_found,
                }
            )

            needed_indicators = needed_indicators - useful_keys

    print(f"   > Selected {len(final_selection)} locations based on station history.")
    for sel in final_selection:
        print(f"     - Loc {sel['id']}: {sel['fetch_names']}")

    if needed_indicators:
        print(f"   ! Warning: No valid sensors found for: {needed_indicators}")

    return final_selection


# -------------------------------------------------------
# STEP 3: List S3 Files
# -------------------------------------------------------
def list_s3_keys(location_id):
    prefix = f"records/csv.gz/locationid={location_id}/"
    paginator = s3.get_paginator("list_objects_v2")
    pages = paginator.paginate(Bucket=BUCKET, Prefix=prefix)
    keys = []
    for page in pages:
        for obj in page.get("Contents", []):
            keys.append(obj["Key"])
    return keys


# -------------------------------------------------------
# STEP 4: Download & Process
# -------------------------------------------------------
def process_location_data(loc_data, country_name):
    loc_id = loc_data["id"]
    target_sensor_ids = loc_data["fetch_sensor_ids"]

    keys = list_s3_keys(loc_id)
    if not keys:
        return None

    print(
        f"   > Downloading {loc_data['name']} (ID:{loc_id}). Sensors: {target_sensor_ids}"
    )

    merged_df = []

    for key in tqdm(keys, desc=f"Loc {loc_id}", leave=False):
        try:
            obj = s3.get_object(Bucket=BUCKET, Key=key)
            with gzip.GzipFile(fileobj=obj["Body"]) as gz:
                df = pd.read_csv(gz)

                # Filter by Sensor ID (The most accurate way)
                if "sensors_id" in df.columns:
                    df = df[df["sensors_id"].isin(target_sensor_ids)]
                elif "sensor_id" in df.columns:
                    df = df[df["sensor_id"].isin(target_sensor_ids)]

                if not df.empty:
                    # ------------------------------------
                    # ADD COUNTRY COLUMN HERE
                    # ------------------------------------
                    df["country"] = country_name
                    df["location_id"] = loc_id
                    merged_df.append(df)

        except Exception as e:
            # S3 Read error (corrupt file, etc)
            continue

    if merged_df:
        return pd.concat(merged_df, ignore_index=True)
    return None


# -------------------------------------------------------
# MAIN EXECUTION
# -------------------------------------------------------
def run_all():
    final_dfs = []

    for country in countries:
        if country.get("done", False):
            continue

        c_id = country["id"]
        c_name = country["name"]

        print(f"\nProcessing Country: {c_name} (ID={c_id})")
        print("-" * 40)

        # 1. Get Metadata
        all_locs = get_all_locations_metadata(c_id)
        if not all_locs:
            print("No locations found.")
            continue

        # 2. Select Best Locations (History based)
        selected_targets = optimize_locations(all_locs)

        if not selected_targets:
            print("No suitable locations found matching criteria.")
            continue

        print(f"Selected {len(selected_targets)} locations.")

        # 3. Download & Filter
        for target in selected_targets:
            df = process_location_data(target, c_name)
            if df is not None and not df.empty:
                final_dfs.append(df)

        country["done"] = True

    # Save to CSV
    if final_dfs:
        full_df = pd.concat(final_dfs, ignore_index=True)

        # Move 'country' to the front for better visibility
        cols = ["country", "location_id"] + [
            c for c in full_df.columns if c not in ["country", "location_id"]
        ]
        full_df = full_df[cols]

        if os.path.exists(OUTPUT_FILE):
            print(f"\nAppending data to {OUTPUT_FILE}")
            full_df.to_csv(OUTPUT_FILE, mode="a", header=False, index=False)
        else:
            print(f"\nSaving new CSV to {OUTPUT_FILE}")
            full_df.to_csv(OUTPUT_FILE, index=False)
    else:
        print("\nNo data collected.")


if __name__ == "__main__":
    run_all()
