# 1.0 - Initial Release
Built a complete pipeline for data processing and feature engineering.

## Data Preprocessing Steps:
- Used Ordinal Encoding, One-Hot Encoding for categorical variables.
- KNN Imputer for handling missing values in UHS service index column.
- Applied Standard Scaling and Min-Max Scaling for numerical features.
- Outlier detection and removal using IQR method (capping or Winsorization).
## Feature Engineering:
- Cyclic encoding for dates, months, weeks.
- Added day of week and quarter features.