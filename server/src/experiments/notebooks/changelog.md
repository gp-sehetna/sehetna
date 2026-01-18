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

## [3.1] New Model Architecture | 09-01-2026

### Add
- A Multi-CNN Encoder with BiLSTM & BiGRU model architecture.

### Edit
#### Preprocessing
- Enhanced preprocessing pipeline code structure for better readability and maintainability.
- Scaled target variables & unscale predictions accordingly.

#### Splitting
- Apply proper pipeline fitting only on training data to avoid data leakage.

#### Feature Selection
- MultiTaskElasticNetCV & L2-norm aggregation
- Permutation importance using Random Forest: **ONLY to validate**.

#### Model Architecture
```py
CNN_BiGRU_BILSTM_Model(
  (country_embed): Embedding(25, 4)
  (cnn): TemporalCNNEncoder(
    (layers): ModuleList(
      (0): TemporalCNNBlock(
        (block): Sequential(
          (0): Conv1d(16, 32, kernel_size=(3,), stride=(1,), padding=(1,))
          (1): BatchNorm1d(32, eps=1e-05, momentum=0.1, affine=True, track_running_stats=True)
          (2): ReLU()
          (3): Dropout(p=0.06422203337487818, inplace=False)
        )
      )
    )
  )
  (bigru): GRU(32, 64, num_layers=3, batch_first=True, dropout=0.06422203337487818, bidirectional=True)
  (bilstm): LSTM(128, 96, batch_first=True, dropout=0.06422203337487818, bidirectional=True)
  (head): Sequential(
    (0): LayerNorm((192,), eps=1e-05, elementwise_affine=True)
    (1): Linear(in_features=192, out_features=96, bias=True)
    (2): ReLU()
    (3): Linear(in_features=96, out_features=32, bias=True)
    (4): ReLU()
    (5): Linear(in_features=32, out_features=5, bias=True)
  )
)
```

**Contributors:** *mohamed-hussien*

---

## [4.0] Modelling Pipeline | 29-12-2025

### Add
- PatchTST Model

#### Modelling
- Used PatchTST with prediction length.
- Included new features (targets history) and updated preprocessing pipeline accordingly.
- Achieved significant performance (Overall Macro RMSE: 0.8055) improvements over previous LSTM model (check results in the notebook for more details).

#### Model Architecture
```py
PatchTST(
  (model): PatchTSTForPrediction(
    (model): PatchTSTModel(
      (scaler): PatchTSTScaler(
        (scaler): PatchTSTStdScaler()
      )
      (patchifier): PatchTSTPatchify()
      (masking): Identity()
      (encoder): PatchTSTEncoder(
        (embedder): PatchTSTEmbedding(
          (input_embedding): Linear(in_features=6, out_features=128, bias=True)
        )
        (positional_encoder): PatchTSTPositionalEncoding(
          (positional_dropout): Identity()
        )
        (layers): ModuleList(
          (0-2): 3 x PatchTSTEncoderLayer(
            (self_attn): PatchTSTAttention(
              (k_proj): Linear(in_features=128, out_features=128, bias=True)
              (v_proj): Linear(in_features=128, out_features=128, bias=True)
              (q_proj): Linear(in_features=128, out_features=128, bias=True)
              (out_proj): Linear(in_features=128, out_features=128, bias=True)
            )
            (dropout_path1): Identity()
            (norm_sublayer1): PatchTSTBatchNorm(
              (batchnorm): BatchNorm1d(128, eps=1e-05, momentum=0.1, affine=True, track_running_stats=True)
            )
            (ff): Sequential(
              (0): Linear(in_features=128, out_features=512, bias=True)
              (1): GELUActivation()
              (2): Identity()
              (3): Linear(in_features=512, out_features=128, bias=True)
            )
            (dropout_path3): Identity()
            (norm_sublayer3): PatchTSTBatchNorm(
              (batchnorm): BatchNorm1d(128, eps=1e-05, momentum=0.1, affine=True, track_running_stats=True)
            )
          )
        )
      )
    )
    (head): PatchTSTPredictionHead(
      (flatten): Flatten(start_dim=2, end_dim=-1)
      (projection): Linear(in_features=128, out_features=1, bias=True)
      (dropout): Identity()
    )
  )
)
```

**Contributors:** *abdelrahman-hussien*

---

## [5.0] LightGBM Model for User Scenario – Simulation mode | 09-01-2026

### Add
- Implemented LightGBM model for time series point prediction NOT forecasting.

#### Modelling
- Used Temporal Cross-Validation Ensemble Technique.
- Achieved significant performance (Overall Macro RMSE: ~0.615)

### Edit
- Remove preprocessing & FE pipeline (Scaling, Imputation) as LightGBM can handle raw data.
- Remove country embeddings and sequence data structure.

### Notes
- **SHOULD** update feature engineering to include important features only according to feature selection process.
- Further hyperparameter tuning can be done to improve performance.
- Different features should be used for those targets: cardio_mortality_rate, waterborne_disease_incidents as they have the lowest performance.

**Contributors:** *mohamed-hussien*

---

## [5.1] LightGBM Preprocessing Adjustments – Simulation mode | 09-01-2026

### Add
- Feature Engineering processing for LightGBM model.

#### Modelling
- Better significant performance (Overall Macro RMSE: ~0.604)

### Edit
- Swap processes preprocessing & FE pipeline

### Notes
- Hybrid models should be levereged to improve performance e.g., GAM + LightGBM.
- Different features should be used for those targets: cardio_mortality_rate, waterborne_disease_incidents as they have the lowest performance.

**Contributors:** *mohamed-hussien*

---

## [Unreleased]

### Add
- [Describe new features]

### Edit
- [Describe modifications]

### Fixed
- [Describe bug fixes]

**Contributors:** [Add developer names here]