# Global Climate-Health Impact Tracker (2015-2025)

## 📊 Dataset Overview

This comprehensive dataset tracks the relationship between climate events and health outcomes across 25 countries from 2015 to 2025. It combines climate indicators, air quality measurements, health statistics, and socioeconomic factors to enable research on climate change impacts on public health.

**Dataset Size**: 14,100 records  
**Time Period**: January 2015 - October 2025 (Weekly frequency)  
**Geographic Coverage**: 25 countries across 8 regions  
**Total Features**: 30 columns

## 🎯 Use Cases

- **Climate-Health Research**: Analyze correlations between climate events and health outcomes
- **Predictive Modeling**: Build models to forecast health impacts from climate patterns
- **Policy Analysis**: Evaluate healthcare system preparedness for climate-related health risks
- **Time Series Analysis**: Study trends in climate change and health outcomes over 10+ years
- **Comparative Studies**: Compare climate-health relationships across income levels and regions
- **Data Visualization**: Create compelling visualizations of global climate-health patterns

## 📁 Dataset Structure

### Geographic Dimensions
- `record_id`: Unique identifier for each record
- `country_code`: ISO 3-letter country code
- `country_name`: Full country name
- `region`: Geographic region (8 regions)
- `income_level`: World Bank income classification (High, Upper-Middle, Lower-Middle)
- `latitude`, `longitude`: Geographic coordinates
- `population_millions`: Population in millions

### Temporal Dimensions
- `date`: Week start date (YYYY-MM-DD)
- `year`: Year (2015-2025)
- `month`: Month (1-12)
- `week`: ISO week number

### Climate Indicators
- `temperature_celsius`: Average weekly temperature
- `temp_anomaly_celsius`: Temperature deviation from historical average
- `precipitation_mm`: Total weekly precipitation
- `heat_wave_days`: Number of heat wave days in the week
- `drought_indicator`: Binary indicator for drought conditions
- `flood_indicator`: Binary indicator for flood events
- `extreme_weather_events`: Total count of extreme events

### Air Quality
- `pm25_ugm3`: PM2.5 particulate matter concentration (μg/m³)
- `air_quality_index`: Overall air quality index (0-500)

### Health Outcomes (rates per 100,000 population)
- `respiratory_disease_rate`: Respiratory illness incidence rate
- `cardio_mortality_rate`: Cardiovascular mortality rate
- `vector_disease_risk_score`: Risk score for vector-borne diseases (malaria, dengue)
- `waterborne_disease_incidents`: Waterborne disease incident rate
- `heat_related_admissions`: Hospital admissions due to heat-related illness

### Socioeconomic & Health System
- `healthcare_access_index`: Healthcare system accessibility (0-100)
- `gdp_per_capita_usd`: GDP per capita in USD

### Wellbeing Indicators
- `mental_health_index`: Population mental health score (0-100)
- `food_security_index`: Food security score (0-100)

## 📈 Key Statistics

- **Temporal Coverage**: 11 years of weekly data
- **Missing Values**: 0 (100% complete)
- **Extreme Weather Events**: 2,334 total events tracked
- **Temperature Range**: -20.7°C to 38.3°C
- **Countries**: USA, India, China, Brazil, Nigeria, Germany, Japan, UK, France, Australia, Kenya, Mexico, Indonesia, Pakistan, Bangladesh, Egypt, South Africa, Canada, Spain, Italy, Thailand, Philippines, Vietnam, Argentina, Colombia

## 🔬 Methodology

This dataset synthesizes patterns from multiple authoritative sources including:
- World Bank Climate Data
- WHO Global Health Observatory
- Climate reanalysis models
- Air quality monitoring networks
- National health statistics

Data follows realistic statistical distributions and correlations observed in climate-health research literature.

## 💡 Sample Analysis Ideas

1. **Correlation Analysis**: Examine relationships between temperature anomalies and respiratory disease rates
2. **Regional Comparisons**: Compare climate-health impacts across income levels
3. **Trend Detection**: Identify long-term trends in climate indicators and health outcomes
4. **Machine Learning**: Build predictive models for health outcomes based on climate indicators
5. **Time Series Forecasting**: Forecast future health risks under different climate scenarios
6. **Visualization**: Create interactive dashboards showing climate-health relationships

## 📚 Citation

If you use this dataset in your research or analysis, please cite:

```
Global Climate-Health Impact Tracker (2015-2025)
Created: October 2025
Source: Kaggle Datasets
```

## 📄 License

This dataset is released under **CC0: Public Domain**. You are free to use, modify, and distribute this data for any purpose.

## 🤝 Acknowledgments

This dataset was created to support research on climate change impacts on public health and to facilitate data-driven policy decisions.

## 📧 Contact

For questions or feedback about this dataset, please use the Kaggle discussion forum.

---

**Version**: 1.0  
**Last Updated**: October 2025  
**Data Quality**: 100% complete, 0% missing values
