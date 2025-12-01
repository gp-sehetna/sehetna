import numpy as np;
import pandas as pd;
from sklearn.neighbors import NearestNeighbors;
import matplotlib.pyplot as plt;
import seaborn as sns;
from sklearn.preprocessing import OrdinalEncoder , OneHotEncoder , StandardScaler;
from sklearn.impute import KNNImputer;
import os;
import math;


pd.set_option("display.max_columns", None)


# 1. LOAD YOUR DATA
df  = pd.read_csv('D:\GP\sehetna\data\global_climate_health_impact_tracker_2015_2025.csv')
# df.info();

# Feature group definitions:
# --------------------------
# The following lists categorize dataset columns into logical groups used for 
# preprocessing, feature engineering, validation, and model input selection.
# This structure helps keep the pipeline modular, clear, and maintainable.

# demographic_cols: Socioeconomic indicators affecting health vulnerability.
# geographic_cols: Spatial identifiers used for mapping, merging, and regional analysis.
# date_cols: Temporal breakdown used for seasonality, trend analysis, and lag features.
# climate_cols: Core environmental/climatic variables influencing public health outcomes.
# air_quality_cols: Pollutant and air-quality measures for exposure and AQI modeling.
# health_indicators_cols: Health outcome metrics and indices used as targets or explanatory variables.

demographic_cols = ['income_level', 'population_millions', 'gdp_per_capita_usd']
geographic_cols = ['country_code', 'country_name', 'region', 'latitude', 'longitude']
date_cols = ['date', 'year', 'month', 'week']
climate_cols = ['temperature_celsius', 'temp_anomaly_celsius', 'precipitation_mm', 'heat_wave_days', 'drought_indicator', 'flood_indicator', 'extreme_weather_events']
air_quality_cols = ['pm25_ugm3', 'aqi_pm', 'air_quality_index']
health_indicators_cols = ['respiratory_disease_rate', 'cardio_mortality_rate', 'vector_disease_risk_score', 'waterborne_disease_incidents', 'heat_related_admissions', 'healthcare_access_index', 'mental_health_index', 'food_security_index', 'uhs_service_coverage_index']


# Convert the 'date' column from string format to a proper datetime type
# so pandas can perform time-based operations (filtering, extracting year/month,
# resampling, rolling windows, etc.). Printing dtype confirms the conversion.

df['date'] = pd.to_datetime(df['date'])
print(df['date'].dtype)


# Extract all numerical values.
numerical_cols_df = df.select_dtypes(include=['int64', 'float64'])
numerical_cols_df.dtypes

# # Inspect the 'uhs_service_coverage_index' column:
# # 1. .info() shows the column's data type and whether it contains null values
# df['uhs_service_coverage_index'].info()


# # 2. Count how many missing (NaN) values exist in this column.
# missing_values_count = df['uhs_service_coverage_index'].isna().sum()
# print(f"Number of missing values in 'uhs_service_coverage_index': {missing_values_count}")

# # 3. Compute descriptive statistics (mean, std, min, max, etc.)
# #    Only using non-missing values by dropping NaNs.
# descriptive_stats = df['uhs_service_coverage_index'].dropna().describe()
# print("Descriptive statistics for 'uhs_service_coverage_index' (non-missing values):\n")
# print(descriptive_stats)

# Plot a histogram of the 'uhs_service_coverage_index' column to visualize
# spread, and skewness of the data.
# plt.figure(figsize=(5, 3))

# sns.histplot(df['uhs_service_coverage_index'], bins=20, kde=True, color='blue', label='All Values', alpha=0.5)
# plt.title('Distribution')
# plt.xlabel('UHS Value')
# plt.ylabel('Count')
# plt.legend()
# plt.show()

income_level_order = df['income_level'].unique().tolist()

ordinal_encoder = OrdinalEncoder(categories=[income_level_order], handle_unknown='use_encoded_value', unknown_value=-1)
df['income_level_encoded'] = ordinal_encoder.fit_transform(df[['income_level']])

print(df[['income_level', 'income_level_encoded']].head(2))

# One-hot encode nominal categorical columns
nominal_cols = ['country_code', 'country_name', 'region']
df_encoded_nominal = pd.get_dummies(df[nominal_cols], prefix=nominal_cols, dtype=int)


# One-hot encode nominal categorical columns
nominal_cols = ['country_code', 'country_name', 'region']
df_encoded_nominal = pd.get_dummies(df[nominal_cols], prefix=nominal_cols, dtype=int)

# Concatenate the new encoded features with the original DataFrame
cat_enc_df = pd.concat([df, df_encoded_nominal], axis=1)


# Drop the original categorical columns
cat_enc_df.drop(columns=nominal_cols + ['income_level'], inplace=True)

print(cat_enc_df.head())


# Identify numerical columns to scale
numerical_cols = df.select_dtypes(include=['int64', 'float64']).columns.tolist()

# Dynamically exclude one-hot encoded columns based on prefixes
exclude_cols = [f"{col}_{val}" for col in nominal_cols for val in df[col].unique()]

# Exclude ID, ordinal encoded, and one-hot encoded columns
exclude_cols.extend(['record_id', 'income_level_encoded'])

# Filter out excluded columns
scaling_cols = [col for col in numerical_cols if col not in exclude_cols]

print(f"Columns identified for scaling: {scaling_cols}")

# Instantiate StandardScaler
scaler = StandardScaler()

# Apply scaling to the identified numerical columns
df[scaling_cols] = scaler.fit_transform(df[scaling_cols])

# print("Numerical features scaled successfully. Displaying head of updated DataFrame:")
# print(df[scaling_cols].head())
# print("\nDescriptive statistics of scaled features:")
# print(df[scaling_cols].describe())


# Instantiate KNNImputer
# Using n_neighbors=5 as a common starting point
knn_imputer = KNNImputer(n_neighbors=5)

df_imputed_array = knn_imputer.fit_transform(df[scaling_cols])
df[scaling_cols] = pd.DataFrame(df_imputed_array, columns=scaling_cols, index=df.index)

print("KNN imputation completed for selected numerical columns.")

# Verify that there are no more missing values in 'uhs_service_coverage_index'
missing_after_imputation = df['uhs_service_coverage_index'].isna().sum()
print(f"Number of missing values in 'uhs_service_coverage_index' after KNN imputation: {missing_after_imputation}")

print("Descriptive statistics for 'uhs_service_coverage_index' after imputation:")
print(df['uhs_service_coverage_index'].describe())



# Plotting uhs_service_coverage_index column after fill missing values.
plt.figure(figsize=(5, 3))

sns.histplot(df['uhs_service_coverage_index'], bins=20, kde=True, color='blue', label='All Values', alpha=0.5)
plt.title('Distribution')
plt.xlabel('UHS Value')
plt.ylabel('Count')
plt.legend()
plt.show()


# Outlier Detection and Treatment.
check_outlier_cols = [
    'respiratory_disease_rate', 'cardio_mortality_rate', 'vector_disease_risk_score',
    'waterborne_disease_incidents', 'heat_related_admissions', 'healthcare_access_index',
    'mental_health_index', 'food_security_index', 'uhs_service_coverage_index',
    'pm25_ugm3', 'air_quality_index', 'population_millions', 'gdp_per_capita_usd',
    'temperature_celsius', 'temp_anomaly_celsius', 'precipitation_mm', 'heat_wave_days'
]

n_cols = 3
n_rows = math.ceil(len(check_outlier_cols) / n_cols)

fig, axes = plt.subplots(n_rows, n_cols, figsize=(18, 5 * n_rows))
axes = axes.flatten()

for i, col in enumerate(check_outlier_cols):
    sns.boxplot(y=df[col], ax=axes[i])
    axes[i].set_title(f'Box plot of {col}')
    axes[i].set_ylabel(col)

# Hide empty subplots
for j in range(i + 1, len(axes)):
    axes[j].set_visible(False)

plt.tight_layout()
plt.show()



def detect_and_cap_outliers(df, cols, multiplier=1.5, cap=False, show_examples=5):
    """
    Function: detect_and_cap_outliers

    Description:
        Detects outliers in specified numerical columns of a DataFrame using the Interquartile Range (IQR) method.
        Optionally, it can also cap (winsorize) the outliers to the calculated lower and upper bounds to reduce their impact.
        Provides detailed summary statistics and examples of detected outliers for inspection.

    Parameters:
        df (pd.DataFrame)       : The input DataFrame containing the data.
        cols (list)             : List of column names to check for outliers.
        multiplier (float)      : The IQR multiplier to define outlier bounds. Default is 1.5 (common choice for mild outliers).
        cap (bool)              : If True, caps the outliers to the calculated bounds. Default is False.
        show_examples (int)     : Number of example outliers to display for each column. Default is 5.

    Returns:
        df (pd.DataFrame)       : DataFrame with outliers optionally capped.
        results (dict)          : Dictionary containing IQR statistics, bounds, and number of outliers for each column.

    Usage:
        df, outlier_stats = detect_and_cap_outliers(df, cols=['temperature', 'pm25_ugm3'], cap=True)

    Notes:
        - Outliers are defined as values below Q1 - multiplier*IQR or above Q3 + multiplier*IQR.
        - If 'cap=True', values outside these bounds are replaced with the respective lower or upper bound.
        - This function helps in robust feature preprocessing before modeling.
    """

    
    results = {}

    for col in cols:
        series = df[col].dropna()

        Q1 = series.quantile(0.25)
        Q3 = series.quantile(0.75)
        IQR = Q3 - Q1

        lower = Q1 - multiplier * IQR
        upper = Q3 + multiplier * IQR

        # Detect outliers
        outliers = df[(df[col] < lower) | (df[col] > upper)]

        print("=" * 70)
        print(f"Outlier Summary for **{col}**")
        print("-" * 70)
        print(f"Q1: {Q1:.3f}")
        print(f"Q3: {Q3:.3f}")
        print(f"IQR: {IQR:.3f}")
        print(f"Lower Bound: {lower:.3f}")
        print(f"Upper Bound: {upper:.3f}")
        print(f"Outlier Count: {len(outliers)}\n")

        if len(outliers) > 0:
            print(f"First {show_examples} outliers:")
            print(outliers[[col]].head(show_examples))
        else:
            print("No outliers detected.")
            continue

        # Store results
        results[col] = {
            "Q1": Q1, "Q3": Q3, "IQR": IQR,
            "lower_bound": lower, "upper_bound": upper,
            "num_outliers": len(outliers)
        }

        #  CAP OUTLIERS (WINSORIZATION)
        if cap:
            print("\nApplying capping (winsorization)...")

            df[col] = df[col].clip(lower=lower, upper=upper)

            print(f"✔ Outliers in '{col}' have been capped.")

            # Verify that no outliers remain
            rem = df[(df[col] < lower) | (df[col] > upper)]
            print(f"Remaining outliers after capping: {len(rem)}")

            # Show updated descriptive statistics
            print("\nUpdated Stats:")
            print(df[col].describe())

    return df, results;

df, _ = detect_and_cap_outliers(df, check_outlier_cols, cap=True);



# --- 2. DROPPING USELESS COLUMNS ---
if 'record_id' in df.columns:
    df = df.drop(columns=['record_id']);

# --- 1. CLEANING (Fixing the errors you found) ---

# Fix Negative AQI
df['air_quality_index'] = df['air_quality_index'].clip(lower=0)

# Fix Healthcare Index > 100 (Optional, but recommended)
df['healthcare_access_index'] = df['healthcare_access_index'].clip(upper=100)

# print("Preprocessing Complete.")
print("Min values should now be 0.0 and Max values should be 1.0")
print(df.describe().loc[['min', 'max']].T)

#########################################
########## Feature engineering ##########
#########################################

# print(df['country_code'] , df['date']);
# 2. Create the Lag Feature (pm25_lag_1w)
# This takes the PM2.5 value from the PREVIOUS row (1 week ago)
# We group by 'country_code' so we don't accidentally shift data from one country to another.
df['pm25_lag_1w'] = df.groupby('country_code')['pm25_ugm3'].shift(1)

# 3. Create the Rolling Average Feature (temp_4w_avg)
# This calculates the average temperature of the CURRENT week + previous 3 weeks.
# It represents "chronic heat exposure" rather than just one hot day.
df['temp_4w_avg'] = df.groupby('country_code')['temperature_celsius'].transform(
    lambda x: x.rolling(window=4).mean()
)

# 4. Remove the empty rows created by shifting
# The first week of data for every country will now be NaN (because there is no "previous week").
# We must drop these rows.
df = df.dropna().reset_index(drop=True)
 
print(df[['country_code', 'date', 'pm25_ugm3', 'pm25_lag_1w', 'temp_4w_avg']].head());



# Convert Month to Coordinates on a Circle
df['month-sin'] = np.sin( 2 * np.pi * (df['month']/12) )
df['month-cos'] = np.cos( 2 * np.pi * (df['month']/12) )

# Convert Week to Coordinates (53 weeks in a year)
df['week-sin'] = np.sin( 2 * np.pi * (df['week']/53) )
df['week-cos'] = np.sin( 2 * np.pi * (df['week']/53) )

# Now DROP the original 'month' and 'week' columns so the model doesn't get confused
df = df.drop(columns=['month', 'week']) 


# Apply Log to the Target Variable
# We add +1 because log(0) is impossible
df['log_respiratory_rate'] = np.log1p(df['respiratory_disease_rate'])

# IMPORTANT: When you get a prediction from the model, you must reverse it!
# prediction = model.predict(X_test)
# final_prediction = np.expm1(prediction)  # Reverses the log

# This allows the model to understand the "Curve" or U-shape
df['temp_squared'] = df['temperature_celsius'] ** 2

# Applying Spatial Lag Features (The "Neighbor" Effect)



# 1. Prepare Coordinates
coords = df[['latitude' , 'longitude']].values

# 2. Find 5 Nearest Neighbors for each row
nbrs = NearestNeighbors(n_neighbors=5 , algorithm='ball_tree').fit(coords)
distances , indices = nbrs.kneighbors(coords)

# 3. Calculate Spatial Lag for Respiratory Disease
# We take the average disease rate of the 5 neighbors (excluding the country itself)

neighbor_indices = indices[: , 1:] # Drop the first one (itself)
neighbor_rates = df['respiratory_disease_rate'].values[neighbor_indices]
# Calculate the mean of the 4 neighbors countries respiratory diseases
df['spatial_lag_resp_disease'] = np.mean(neighbor_rates , axis=1);  

# Feature selection using BurtA SHAP.
#
#
#
# End of BurtA SHAP.
