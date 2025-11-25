# Global Climate-Health Impact Tracker - Column Descriptions

## Geographic & Identification Columns

**record_id** (Integer)
- Unique identifier for each record
- Sequential numbering from 1 to 14,100
- Primary key for the dataset

**country_code** (String)
- ISO 3166-1 alpha-3 country code
- Examples: USA, IND, CHN, BRA, NGA
- Used for international standardization

**country_name** (String)
- Full name of the country
- Examples: United States, India, China, Brazil
- Human-readable country identification

**region** (Categorical)
- Geographic region classification
- Values: North America, South America, Europe, Africa, Asia, Southeast Asia, East Asia, South Asia, Oceania
- Used for regional comparisons

**income_level** (Categorical)
- World Bank income classification
- Values: High, Upper-Middle, Lower-Middle
- Indicates economic development level

**latitude** (Float)
- Geographic latitude coordinate
- Range: -90 to 90 degrees
- Used for spatial analysis

**longitude** (Float)
- Geographic longitude coordinate
- Range: -180 to 180 degrees
- Used for spatial analysis

**population_millions** (Float)
- Country population in millions
- Static value (as of 2025)
- Used for per-capita calculations

## Temporal Columns

**date** (Date String, YYYY-MM-DD)
- Week start date
- Range: 2015-01-04 to 2025-10-19
- Weekly frequency (every 7 days)

**year** (Integer)
- Calendar year
- Range: 2015-2025
- Used for yearly aggregations

**month** (Integer)
- Month of the year
- Range: 1-12
- Used for seasonal analysis

**week** (Integer)
- ISO week number
- Range: 1-53
- Used for weekly patterns

## Climate Indicator Columns

**temperature_celsius** (Float)
- Average weekly temperature in Celsius
- Range: approximately -21°C to 38°C
- Includes seasonal variation and climate trends

**temp_anomaly_celsius** (Float)
- Temperature deviation from historical baseline
- Positive values indicate warming
- Shows climate change signal

**precipitation_mm** (Float)
- Total weekly precipitation in millimeters
- Range: 0-200+ mm
- Includes seasonal patterns

**heat_wave_days** (Integer)
- Number of days with extreme heat in the week
- Range: 0-7
- Defined as temperatures significantly above normal

**drought_indicator** (Binary: 0 or 1)
- Indicates drought conditions
- 1 = drought present, 0 = no drought
- Based on precipitation thresholds

**flood_indicator** (Binary: 0 or 1)
- Indicates flooding events
- 1 = flood event, 0 = no flood
- Based on extreme precipitation

**extreme_weather_events** (Integer)
- Total count of extreme events in the week
- Sum of heat_wave_days + drought_indicator + flood_indicator
- Range: 0-10+

## Air Quality Columns

**pm25_ugm3** (Float)
- PM2.5 particulate matter concentration
- Unit: micrograms per cubic meter (μg/m³)
- WHO guideline: 5 μg/m³ annual mean

**air_quality_index** (Float)
- Overall air quality index
- Range: 0-500
- 0-50 = Good, 51-100 = Moderate, 101-150 = Unhealthy for sensitive groups, 151+ = Unhealthy

## Health Outcome Columns (All rates per 100,000 population)

**respiratory_disease_rate** (Float)
- Weekly respiratory illness incidence rate per 100,000
- Includes asthma, COPD, bronchitis exacerbations
- Influenced by air quality and weather

**cardio_mortality_rate** (Float)
- Cardiovascular mortality rate per 100,000
- Heat-sensitive health outcome
- Higher during extreme temperature events

**vector_disease_risk_score** (Float)
- Risk score for vector-borne diseases (0-100)
- Includes malaria, dengue, other mosquito-borne diseases
- Higher in tropical regions with suitable temperatures

**waterborne_disease_incidents** (Float)
- Waterborne disease incident rate per 100,000
- Increases after flooding events
- Influenced by healthcare infrastructure

**heat_related_admissions** (Float)
- Hospital admissions due to heat-related illness per 100,000
- Heat stroke, dehydration, heat exhaustion
- Spikes during heat waves

## Socioeconomic & Health System Columns

**healthcare_access_index** (Float)
- Healthcare system accessibility score (0-100)
- Higher values indicate better access
- Varies by income level

**gdp_per_capita_usd** (Float)
- Gross Domestic Product per capita in USD
- Includes year-over-year growth
- Indicator of economic resources

## Wellbeing Indicator Columns

**mental_health_index** (Float)
- Population mental health score (0-100)
- Affected by climate disasters and extreme events
- Higher scores indicate better mental health

**food_security_index** (Float)
- Food security score (0-100)
- Impacted by droughts and floods
- Higher scores indicate better food security

---

## Data Types Summary

- **Integer**: record_id, year, month, week, heat_wave_days, drought_indicator, flood_indicator, extreme_weather_events
- **Float**: latitude, longitude, population_millions, temperature_celsius, temp_anomaly_celsius, precipitation_mm, pm25_ugm3, air_quality_index, all health rates, healthcare_access_index, gdp_per_capita_usd, mental_health_index, food_security_index
- **String**: country_code, country_name, date
- **Categorical**: region, income_level

## Missing Values

**All columns**: 0% missing (100% complete)
