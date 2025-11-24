# Install dependencies as needed:
# pip install kagglehub[pandas-datasets]
import os
import kagglehub
from kagglehub import KaggleDatasetAdapter
import pandas as pd
from matplotlib import pyplot as plt
from Constants import BREAKPOINTS, pollutant_to_aqi

pd.set_option("display.max_columns", None)
# pd.set_option('display.max_rows', None)
pd.set_option("display.width", 80 * 2)

def get_data(file_path: str, save_path: str):
    # Load the latest version
    df: pd.DataFrame = kagglehub.dataset_load(
        KaggleDatasetAdapter.PANDAS,
        "sohumgokhale/global-climate-health-impact-tracker-2015-2025",
        file_path,
    )

    if not os.path.exists(save_path):
        os.makedirs(os.path.dirname(save_path), exist_ok=True)
        df.to_csv(save_path, index=False)

    pd.set_option("display.width", 80 * 4)
    return df


def main():
    file_path = "global_climate_health_impact_tracker_2015_2025.csv"

    script_path = os.path.abspath(__file__)
    src_path = os.path.dirname(script_path)
    server_path = os.path.dirname(src_path)
    save_path = os.path.join(server_path, "resources", "data", file_path)
    df = get_data(file_path, save_path)

    invalid_aqi = ~df["air_quality_index"].between(0, 500)
    df.loc[:, "aqi_pm"] = df.loc[:, "pm25_ugm3"].apply(
        lambda val: pollutant_to_aqi(BREAKPOINTS["pm25"], val)
    )
    print("\n".join(df['country_code'].unique().tolist()))
    print("\n")
    print("\n".join(df['income_level'].unique().tolist()))
    # print(df[invalid_aqi][['pm25_ugm3', 'air_quality_index']].describe().T)
    
    plot(df)
    print(df[["aqi_pm", "air_quality_index", "pm25_ugm3"]].describe().T)

    # great_pm_conc = df["pm25_ugm3"] >= 150
    # print(df[great_pm_conc][["pm25_ugm3", "air_quality_index"]].describe().T)
    # print(df[['air_quality_index', 'pm25_ugm3']].describe().T)

    # print(df[invalid_mask].index.to_series().diff().value_counts())
    # invalid_mask.mean() * 100 = 2.652482269503546
    # df[invalid_mask]['air_quality_index'].plot(kind='hist', bins=50, title='Not Valid AQI Values (Errors)')
    # plt.show()


def plot(df: pd.DataFrame):
    df[["aqi_pm", "air_quality_index"]].plot(
        kind="hist", bins=50, alpha=0.5, figsize=(8, 5)
    )

    plt.title("AQI Distribution Comparison")
    plt.xlabel("Value")
    plt.ylabel("Count")
    plt.legend(["AQI using PM Breakpoints", "Overall AQI"])

    plt.show()


if __name__ == "__main__":
    main()
