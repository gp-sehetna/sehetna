from src.domain.types import BreakPointsDict

"""
Module-level docstring for Constants.py
This module defines AQI breakpoints for multiple pollutants and provides
utilities to convert pollutant concentrations into AQI values.
Breakpoints
----------
Breakpoints are provided for the following pollutants (EPA-like structure):
- O3 8-hour ("o3_8h") - ozone in ppm (8-hour average)
- O3 1-hour ("o3_1h") - ozone in ppm (1-hour peak; used only when 8-hour O3 >= 0.071 ppm)
- PM2.5 ("pm25") - fine particulate matter in ug/m3 (24-hour)
- PM10 ("pm10") - coarse particulate matter in ug/m3 (24-hour)
- CO ("co") - carbon monoxide in ppm (8-hour)
- SO2 ("so2") - sulfur dioxide in ppb (1-hour)
- NO2 ("no2") - nitrogen dioxide in ppb (1-hour)
Breakpoint data structure
-------------------------
Each pollutant's breakpoints are a sequence (list/tuple) of 4-tuples:
        (c_low, c_high, aqi_low, aqi_high)
where:
- c_low, c_high: numeric concentration interval (inclusive on both ends in
  the conversion function). c_high may be float("inf") for an open upper bound.
- aqi_low, aqi_high: corresponding AQI interval (typically 0-50, 51-100, ...,
  up to 500). The intervals map concentrations to an AQI numeric range.
Usage
-----
- Use BREAKPOINTS to access the breakpoint list for a pollutant by key:
        BREAKPOINTS keys: "o3_8h", "o3_1h", "pm25", "pm10", "co", "so2", "no2".
- Convert a concentration to AQI with:
        pollutant_to_aqi(breakpoints, value)
  The function performs linear interpolation within the matching breakpoint
  interval and returns a numeric AQI. If the matching interval has
  c_high == float("inf"), the implementation returns the corresponding
  aqi_low (no interpolation). If no interval matches, the function returns NaN.
Special notes
-------------
- Ozone: the 8-hour O3 breakpoint list is the primary metric; the 1-hour O3
  breakpoint list is only applicable per EPA logic when the 8-hour O3
  concentration is at or above the threshold (commonly 0.071 ppm).
- Units: ensure concentration values are in the expected units (ppm or ppb
  or ug/m3) before conversion.
- Overall AQI: compute_overall_aqi(values_dict) converts each pollutant value
  to its AQI and returns the maximum AQI across pollutants (EPA rule:
  overall AQI = max individual AQI). The input dict must use the same keys
  as the BREAKPOINTS mapping.
Examples (illustrative, not code)
---------------------------------
- To get the AQI for a PM2.5 concentration of 25 ug/m3, use the pm25 breakpoint
  list and apply pollutant_to_aqi; the result will be the interpolated AQI
  within the 51–100 bracket.
- To compute site-wide AQI, provide a dict of pollutant concentrations keyed
  by pollutant code (e.g., {"pm25": 25, "o3_8h": 0.060, ...}) and call
  compute_overall_aqi to obtain the maximum individual AQI.
This module organizes breakpoint data for clarity and reuse, and it exposes
small utility functions to perform standard AQI calculus consistent with
the breakpoint-based linear interpolation method.
"""

### O3 (ppm) - 8-hour
O3_8H_BREAKPOINTS = [
    (0.000, 0.054, 0, 50),
    (0.055, 0.070, 51, 100),
    (0.071, 0.085, 101, 150),
    (0.086, 0.105, 151, 200),
    (0.106, 0.200, 201, 300),
    (0.201, float("inf"), 301, 500),
]

### O3 (ppm) - 1-hour > Only used when 8-h ozone >= 0.071 (EPA rule)
O3_1H_BREAKPOINTS = [
    (0.125, 0.164, 101, 150),
    (0.165, 0.204, 151, 200),
    (0.205, 0.404, 201, 300),
    (0.405, float("inf"), 301, 500),
]

### PM2.5 (ug/m3) - 24-hour
PM25_BREAKPOINTS = [
    (0.0, 9.0, 0, 50),
    (9.1, 35.4, 51, 100),
    (35.5, 55.4, 101, 150),
    (55.5, 125.4, 151, 200),
    (125.5, 225.4, 201, 300),
    (225.5, float("inf"), 301, 500),
]

### PM10 (ug/m3) - 24-hour
PM10_BREAKPOINTS = [
    (0, 54, 0, 50),
    (55, 154, 51, 100),
    (155, 254, 101, 150),
    (255, 354, 151, 200),
    (355, 424, 201, 300),
    (425, float("inf"), 301, 500),
]

### CO (ppm) - 8-hour
CO_BREAKPOINTS = [
    (0.0, 4.4, 0, 50),
    (4.5, 9.4, 51, 100),
    (9.5, 12.4, 101, 150),
    (12.5, 15.4, 151, 200),
    (15.5, 30.4, 201, 300),
    (30.5, float("inf"), 301, 500),
]

### SO2 (ppb) - 1-hour
SO2_BREAKPOINTS = [
    (0, 35, 0, 50),
    (36, 75, 51, 100),
    (76, 185, 101, 150),
    (186, 304, 151, 200),
    (305, 604, 201, 300),
    (605, float("inf"), 301, 500),
]

### NO2 (ppb) - 1-hour
NO2_BREAKPOINTS = [
    (0, 53, 0, 50),
    (54, 100, 51, 100),
    (101, 360, 101, 150),
    (361, 649, 151, 200),
    (650, 1249, 201, 300),
    (1250, float("inf"), 301, 500),
]

# 2. Unified Breakpoints Dictionary
BREAKPOINTS: BreakPointsDict = {
    "o3_8h": O3_8H_BREAKPOINTS,
    "o3_1h": O3_1H_BREAKPOINTS,
    "pm25": PM25_BREAKPOINTS,
    "pm10": PM10_BREAKPOINTS,
    "co": CO_BREAKPOINTS,
    "so2": SO2_BREAKPOINTS,
    "no2": NO2_BREAKPOINTS,
}

if __name__ == "__main__":
    from pprint import pprint

    print("\nAir Quality Index (AQI) Breakpoints:\n")
    pprint(BREAKPOINTS)
