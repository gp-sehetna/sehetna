# Changelog

## [1.0] Preprocessing Pipeline | 27-11-2025

### Add
- Complete pipeline for data processing and feature engineering

#### Data Preprocessing
- Ordinal Encoding and One-Hot Encoding for categorical variables
- KNN Imputer for handling missing values in UHS service index column
- Standard Scaling and Min-Max Scaling for numerical features
- Outlier detection and removal using IQR method (capping or Winsorization)

#### Feature Engineering
- Cyclic encoding for dates, months, weeks
- Day of week and quarter features extraction

**Contributors:** *mohamed-hussien*, *marwan-sayed*

---

## [2.0] Feature Engineering Phase | 01-12-2025

### Add
- Focus on feature engineering through interactions and lag features

#### Feature Engineering
- Interaction features between key variables (e.g., Photochemical Smog, Vulnerability Effects)
- Lag features for time series data (1-week, 4-week, lags)
- Rolling statistics (mean, median, std) for temporal features.
- Introduced Spatial-lag features based on longitude and latitude columns.
- Mathematical transformations (log, square root) for skewed distributions.

**Contributors:** *marwan-sayed*

---

## [2.1] Feature Engineering Enhancements | 01-12-2025

### Add
- Further enhancements to feature engineering techniques

#### Feature Engineering
- Advanced interaction features using polynomial combinations
- Additional lag features for extended time series analysis
- Focus on completing the pipeline for feature engineering.

**Contributors:** *mohamed-hussien*

---

## [2.2] Feature Engineering - Was Missing | 2-12-2025

### Edit
- Restored Year and Date columns into the final dataframe.

**Contributors:** *abdelrahman-hussien*

---

## [2.3] Target Scaling | 7-12-2025

### Add
- Engineered a `country_id` column for country embedding purposes.
- Applied Scaling to the target variables.

**Contributors:** *mohamed-hussien*

---

## [2.4.1] Adjusted Preprocessing flow and outlier handling per country | 27-12-2025

### Add
- (20) 2-lagged features through STL Target Decomposition.

### Edit
- Preprocessing wasn't focusing on each country's data separately.
- Outlier removal and Scaling per country instead of mixing everything.
- Imputed missing values using KNN Imputer.

**Contributors:** *mohamed-hussien*

---

## [2.4.2] Fixed Pipeline features | 27-12-2025

### Edit
- Make use of ColumnTransformer for preprocessing.
- Fixed X Scaling.

**Contributors:** *mohamed-hussien*

---

## [3.0] Modelling Pipeline | 23-12-2025

### Add
- Complete modelling pipeline with training, validation, and testing phases.

#### Modelling
- Train-val-test split based on temporal data using K-Fold Leave One-Or-More-Year(s)-Out Cross-Validation.
- Sliding Window (sequence) + Country Embeddings Dataset with shape (batch_size, sequence_length, num_features).
- Implemented logging and experiment tracking and Hyperparameter tuning (Bayesian Optimization) using wandb.
- Model evaluation using RMSE, MAE, and R² metrics.
- Integrated model checkpointing for loading and saving best models

#### Model Architecture
```py
LSTMCountryEmbeddings(
  (country_embed): Embedding(25, 32)
  (lstm): LSTM(72, 328, batch_first=True)
  (first_act): SiLU()
  (second_act): ReLU()
  (head): Sequential(
    (0): Linear(in_features=328, out_features=256, bias=True)
    (1): SiLU()
    (2): Dropout(p=0.3896575033867235, inplace=False)
    (3): Linear(in_features=256, out_features=64, bias=True)
    (4): ReLU()
    (5): Dropout(p=0.06679236165100515, inplace=False)
    (6): Linear(in_features=64, out_features=5, bias=True)
  )
)
```

**Contributors:** *mohamed-hussien*, *abdelrahman-hussien*

---

## [Unreleased]

### Add
- [Describe new features]

### Edit
- [Describe modifications]

### Fixed
- [Describe bug fixes]

**Contributors:** [Add developer names here]