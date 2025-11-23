# Install dependencies as needed:
# pip install kagglehub[pandas-datasets]
import os
import kagglehub
from kagglehub import KaggleDatasetAdapter
import numpy as np
import pandas as pd
from IPython.display import display
from matplotlib import pyplot as plt

pd.set_option('display.max_columns', None)
# pd.set_option('display.max_rows', None)
pd.set_option('display.width', 80*2)

def get_data(file_path: str, save_path: str):
    # Load the latest version
    df: pd.DataFrame = kagglehub.dataset_load(
        KaggleDatasetAdapter.PANDAS,
        "sohumgokhale/global-climate-health-impact-tracker-2015-2025",
        file_path
    )
    
    if not os.path.exists(save_path):
        os.makedirs(os.path.dirname(save_path), exist_ok=True)
        df.to_csv(save_path, index=False)
    
    pd.set_option('display.width', 80*4)
    return df
    
def pm25_to_aqi(pm: float) -> float:
    breakpoints = [
        (0.0, 9.0, 0, 50),
        (9.1, 35.4, 51, 100),
        (35.5, 55.4, 101, 150),
        (55.5, 125.4, 151, 200),
        (125.5, 225.4, 201, 300),
        (225.5, float('inf'), 301, 500) # -1 indicates no upper bound
    ]
    
    for c_low, c_high, aqi_low, aqi_high in breakpoints:
        if c_low <= pm <= c_high:
            if c_high == float('inf'):
                return aqi_low
            return (aqi_high - aqi_low) / (c_high - c_low) * (pm - c_low) + aqi_low
    return np.nan
    

def main():
    file_path = "global_climate_health_impact_tracker_2015_2025.csv"
    
    script_path = os.path.abspath(__file__)
    src_path = os.path.dirname(script_path)
    server_path = os.path.dirname(src_path)
    save_path = os.path.join(server_path, "resources", "data", file_path)
    df = get_data(file_path, save_path)
    
    invalid_aqi = ~df['air_quality_index'].between(0, 500)
    df.loc[invalid_aqi, 'air_quality_index'] = df.loc[invalid_aqi, 'pm25_ugm3'].apply(pm25_to_aqi)
    # print(df[invalid_aqi][['pm25_ugm3', 'air_quality_index']].describe().T)
    # print(df[['air_quality_index', 'pm25_ugm3']].describe().T)
    
    great_pm_conc = df['pm25_ugm3'] >= 150
    print(df[great_pm_conc][['pm25_ugm3', 'air_quality_index']].describe().T)
    # print(df[['air_quality_index', 'pm25_ugm3']].describe().T)
    
    # print(df[invalid_mask].index.to_series().diff().value_counts())
    # invalid_mask.mean() * 100 = 2.652482269503546
    # df[invalid_mask]['air_quality_index'].plot(kind='hist', bins=50, title='Not Valid AQI Values (Errors)')
    # plt.show()

if __name__ == "__main__":
    main()