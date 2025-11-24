

from typing import Dict
from modeling.constants.aqi import BREAKPOINTS
from modeling.types import BreakPoint, Pollutants


def pollutant_to_aqi(breakpoints: BreakPoint, value: float) -> float:
    for c_low, c_high, aqi_low, aqi_high in breakpoints:
        if c_low <= value <= c_high:
            if c_high == float("inf"):
                return aqi_low
            return ((aqi_high - aqi_low) / (c_high - c_low)) * (value - c_low) + aqi_low
    return float("nan")


# Compute Overall AQI from all pollutants
def compute_overall_aqi(values_dict: Dict[Pollutants, float]) -> float:
    aqi_values = []
    for pollutant, value in values_dict.items():
        aqi_values.append(pollutant_to_aqi(BREAKPOINTS[pollutant], value))
    return max(aqi_values)  # EPA rule: overall AQI = max individual AQI


if __name__ == "__main__":
    values = {"pm25": 35.5, "o3_8h": 0.070, "co": 5.0, "so2": 20, "no2": 40}
    overall_aqi = compute_overall_aqi(values)
    print(f"\nOverall AQI: {overall_aqi}\n")