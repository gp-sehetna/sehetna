"""
* [OLD FILE: server/src/data_extraction/openaq_sensors.py]

Extracts air quality data from OpenAQ for a specified list of countries,
optimizes location selection based on number of needed parameters in each location.
"""

import requests
import boto3
import gzip
import os
from tqdm import tqdm
from botocore.client import Config
from botocore import UNSIGNED
import pandas as pd

# -------------------------
# CONFIGURATION
# -------------------------
API_KEY = "65e9fb48f54f1a36865d75b9246aabddecf6ed509fd30c4b067bb042d32ea03d"
BUCKET = "openaq-data-archive"
BASE_API_URL = "https://api.openaq.org/v3/locations"

# Map the generic indicator name to the allowed Parameter IDs (from your provided lists)
TARGET_INDICATORS = {
    "co": [4, 8, 102],  # µg/m³, ppm, ppb
    "o3": [3, 10, 32],  # µg/m³, ppm, ppb
    "no2": [5, 7, 15],  # µg/m³, ppm, ppb
    "so2": [6, 9, 101],  # µg/m³, ppm, ppb
    "pm10": [1],  # µg/m³
    "pm25": [2],  # µg/m³
    "pm1": [19],  # Optional based on your list
    "pm4": [19844],  # Optional based on your list
}

countries = [
    #   { "id": 1, "code": "ID", "name": "Indonesia", "done": False },
    #   { "id": 6, "code": "AR", "name": "Argentina", "done": False },
    #   { "id": 9, "code": "IN", "name": "India", "done": False },
    #   { "id": 10, "code": "CN", "name": "China", "done": False },
    #   { "id": 17, "code": "KE", "name": "Kenya", "done": False },
    #   { "id": 22, "code": "FR", "name": "France", "done": False },
    #   { "id": 37, "code": "ZA", "name": "South Africa", "done": False },
    #   { "id": 45, "code": "BR", "name": "Brazil", "done": False },
    #   { "id": 50, "code": "DE", "name": "Germany", "done": False },
    #   { "id": 56, "code": "VN", "name": "Vietnam", "done": False },
    #   { "id": 67, "code": "ES", "name": "Spain", "done": False },
    #   { "id": 79, "code": "GB", "name": "United Kingdom", "done": False },
    #   { "id": 91, "code": "IT", "name": "Italy", "done": False },
    #   { "id": 100, "code": "NG", "name": "Nigeria", "done": False },
    #   { "id": 109, "code": "PK", "name": "Pakistan", "done": False },
    #   { "id": 111, "code": "TH", "name": "Thailand", "done": False },
    {"id": 128, "code": "BD", "name": "Bangladesh", "done": False},
    #   { "id": 138, "code": "CO", "name": "Colombia", "done": False },
    #   { "id": 156, "code": "CA", "name": "Canada", "done": False },
    #   { "id": 157, "code": "MX", "name": "Mexico", "done": False },
    {"id": 162, "code": "EG", "name": "Egypt", "done": False},
    #   { "id": 177, "code": "AU", "name": "Australia", "done": False },
    #   { "id": 183, "code": "PH", "name": "Philippines", "done": False },
    #   { "id": 190, "code": "JP", "name": "Japan", "done": False }
]


OUTPUT_FILE = "./country_data/25_countries_air.csv"
os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)

s3 = boto3.client(
    "s3", region_name="us-east-1", config=Config(signature_version=UNSIGNED)
)


# -------------------------------------------------------
# HELPER: Map ID to Name
# -------------------------------------------------------
def get_indicator_name(param_id):
    """Returns 'co', 'o3', etc. if the param_id is in our target list."""
    for name, ids in TARGET_INDICATORS.items():
        if param_id in ids:
            return name
    return None


# -------------------------------------------------------
# STEP 1 — Get all location metadata
# -------------------------------------------------------
def get_all_locations_metadata(country_id):
    """
    Fetches all locations with their sensor details.
    """
    url = f"{BASE_API_URL}?countries_id={country_id}&limit=1000"
    headers = {"X-API-Key": API_KEY}

    print(f"Fetching metadata for country_id={country_id} ...")
    res = requests.get(url, headers=headers).json()

    if "results" not in res:
        return []

    return res["results"]


# -------------------------------------------------------
# STEP 2 — Logic to Filter & Sort Locations
# -------------------------------------------------------
def optimize_locations(locations):
    """
    Greedy algorithm to find the minimum number of locations
    to satisfy all target indicators, prioritizing dense locations.
    """
    analyzed_locations = []

    for loc in locations:
        loc_id = loc["id"]
        # Structure: { 'co': {'pid': 4, 'sid': 9876}, ... }
        found_indicators = {}

        sensors = loc.get("sensors", [])

        for sensor in sensors:
            p_id = sensor["parameter"]["id"]
            s_id = sensor["id"]  # <--- CAPTURE THE SPECIFIC SENSOR ID
            ind_name = get_indicator_name(p_id)

            if ind_name and ind_name not in found_indicators:
                found_indicators[ind_name] = {"pid": p_id, "sid": s_id}

        if found_indicators:
            analyzed_locations.append(
                {
                    "loc_object": loc,
                    "offers": found_indicators,
                    "count": len(found_indicators),
                }
            )

    # Sort locations descending by how many indicators they have
    analyzed_locations.sort(key=lambda x: x["count"], reverse=True)

    needed_indicators = set(TARGET_INDICATORS.keys())
    final_selection = []

    print(f"   > Needed Indicators: {needed_indicators}")

    for item in analyzed_locations:
        if not needed_indicators:
            break

        offered_keys = set(item["offers"].keys())
        useful_keys = offered_keys.intersection(needed_indicators)

        if useful_keys:
            # We collect the specific SENSOR IDs to fetch
            sensors_to_fetch = []
            names_found = []

            for key in useful_keys:
                # We grab the 'sid' (Sensor ID) we stored earlier
                sensors_to_fetch.append(item["offers"][key]["sid"])
                names_found.append(key)

            final_selection.append(
                {
                    "id": item["loc_object"]["id"],
                    "name": item["loc_object"]["name"],
                    "fetch_sensor_ids": sensors_to_fetch,  # <--- LIST OF SENSOR IDs
                    "fetch_names": names_found,
                }
            )

            needed_indicators = needed_indicators - useful_keys

    print(f"   > Selected {len(final_selection)} locations to cover needs.")
    return final_selection


# -------------------------------------------------------
# STEP 3 — List S3 Keys
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
# STEP 4 — Download, Merge & Filter
# -------------------------------------------------------
def process_location_data(loc_data, country_name):
    loc_id = loc_data["id"]
    target_sensor_ids = loc_data[
        "fetch_sensor_ids"
    ]  # These are the specific sensors we want

    keys = list_s3_keys(loc_id)
    if not keys:
        return None

    print(
        f"   > Downloading {loc_data['name']} (ID:{loc_id}). Keeping sensors: {target_sensor_ids}"
    )

    merged_df = []

    for key in tqdm(keys, desc=f"Loc {loc_id}", leave=False):
        try:
            obj = s3.get_object(Bucket=BUCKET, Key=key)
            with gzip.GzipFile(fileobj=obj["Body"]) as gz:
                df = pd.read_csv(gz)

                # ----------------------------------------
                # CORRECTED FILTERING: Use sensors_id
                # ----------------------------------------
                # The CSV column is usually 'sensors_id' or 'sensor_id'
                if "sensors_id" in df.columns:
                    df = df[df["sensors_id"].isin(target_sensor_ids)]
                elif "sensor_id" in df.columns:
                    df = df[df["sensor_id"].isin(target_sensor_ids)]

                # Double check: if no sensor ID column, fallback to string parameter (less precise)
                elif "parameter" in df.columns:
                    # This is a fallback if sensor_id is missing, but it might mix units
                    df = df[df["parameter"].isin(loc_data["fetch_names"])]

                if not df.empty:
                    df["country"] = country_name
                    df["location_id"] = loc_id
                    merged_df.append(df)
        except Exception as e:
            print(f"Error reading key {key}: {e}")

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

        print("\n=======================================")
        print(f"Processing Country: {c_name} (ID={c_id})")
        print("=======================================\n")

        # 1. Get Metadata
        all_locs = get_all_locations_metadata(c_id)
        if not all_locs:
            print("No locations found.")
            continue
        print(f"   > Found {len(all_locs)} locations.")
        # 2. Select Best Locations (Greedy Logic)
        selected_targets = optimize_locations(all_locs)

        # 3. Download & Filter Data
        for target in selected_targets:
            df = process_location_data(target, c_name)
            if df is not None and not df.empty:
                final_dfs.append(df)

        country["done"] = True

    # Save Results
    if final_dfs:
        full_df = pd.concat(final_dfs, ignore_index=True)

        if os.path.exists(OUTPUT_FILE):
            print(f"Appending data to {OUTPUT_FILE}")
            full_df.to_csv(OUTPUT_FILE, mode="a", header=False, index=False)
        else:
            print(f"Saving new CSV to {OUTPUT_FILE}")
            full_df.to_csv(OUTPUT_FILE, index=False)
    else:
        print("No data collected matching criteria.")


if __name__ == "__main__":
    run_all()
