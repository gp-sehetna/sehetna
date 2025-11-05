# Install dependencies as needed:
# pip install kagglehub[pandas-datasets]
import os
import kagglehub
from kagglehub import KaggleDatasetAdapter
import pandas as pd

if __name__ == "__main__":
    # Set the path to the file you'd like to load
    file_path = "global_climate_health_impact_tracker_2015_2025.csv"
    
    script_path = os.path.abspath(__file__)
    src_path = os.path.dirname(script_path)
    server_path = os.path.dirname(src_path)
    save_path = os.path.join(server_path, "resources", "data", file_path)

    # Load the latest version
    df: pd.DataFrame = kagglehub.dataset_load(
        KaggleDatasetAdapter.PANDAS,
        "sohumgokhale/global-climate-health-impact-tracker-2015-2025",
        file_path
    )
    
    print("\nFirst 5 records:\n", df.head())
    print("Saving to local CSV file: ", save_path)
    
    os.makedirs(os.path.dirname(save_path), exist_ok=True)
    df.to_csv(save_path, index=False)
