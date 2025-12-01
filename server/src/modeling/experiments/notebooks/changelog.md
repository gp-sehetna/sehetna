# Changelog

## [1.0] Preprocessing Pipeline | 27-11-2025

### Added
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

## [1.1] Feature Engineering Phase | 01-12-2025

### Added
- Focus on feature engineering through interactions and lag features

#### Feature Engineering
- Interaction features between key variables (e.g., Photochemical Smog, Vulnerability Effects)
- Lag features for time series data (1-week, 4-week, lags)
- Rolling statistics (mean, median, std) for temporal features.
- Introduced Spatial-lag features based on longitude and latitude columns.
- Mathematical transformations (log, square root) for skewed distributions.

**Contributors:** *marwan-sayed*

---

## [1.2] Feature Engineering Enhancements | 01-12-2025

### Added
- Further enhancements to feature engineering techniques

#### Feature Engineering
- Advanced interaction features using polynomial combinations
- Additional lag features for extended time series analysis
- Focus on completing the pipeline for feature engineering.

**Contributors:** *mohamed-hussien*

---

## [Unreleased]

### Added
- [Describe new features]

### Changed
- [Describe modifications]

### Fixed
- [Describe bug fixes]

**Contributors:** [Add developer names here]