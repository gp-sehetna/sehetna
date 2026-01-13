import pandas as pd
import numpy as np
from datetime import datetime
from typing import Dict, Any
import logging

logger = logging.getLogger(__name__)

class FeatureComputer:
    """Computes all required features from minimal user input"""

    DEFAULT_COORDS = {
        'USA': (37.0902, -95.7129),
        'CHN': (35.8617, 104.1954),
        'IND': (20.5937, 78.9629),
        'BRA': (-14.2350, -51.9253),
        'NGA': (9.0820, 8.6753),
        'DEU': (51.1657, 10.4515),
        'JPN': (36.2048, 138.2529),
        'GBR': (55.3781, -3.4360),
        'FRA': (46.2276, 2.2137),
        'AUS': (-25.2744, 133.7751),
        'KEN': (-0.0236, 37.9062),
        'MEX': (23.6345, -102.5528),
        'IDN': (-0.7893, 113.9213),
        'PAK': (30.3753, 69.3451),
        'BGD': (23.6850, 90.3563),
        'EGY': (26.8206, 30.8025),
        'ZAF': (-30.5595, 22.9375),
        'CAN': (56.1304, -106.3468),
        'ESP': (40.4637, -3.7492),
        'ITA': (41.8719, 12.5674),
        'THA': (15.8700, 100.9925),
        'PHL': (12.8797, 121.7740),
        'VNM': (14.0583, 108.2772),
        'ARG': (-38.4161, -63.6167),
        'COL': (4.5709, -74.2973),
    }

    @staticmethod
    def get_coordinates(country_code: str, lat: float = None, lon: float = None):
        """Get coordinates from user input or defaults"""
        if lat is not None and lon is not None:
            return lat, lon
        
        if country_code in FeatureComputer.DEFAULT_COORDS:
            return FeatureComputer.DEFAULT_COORDS[country_code]
        
        logger.warning(f"No coordinates for {country_code}, using (0, 0)")
        return 0.0, 0.0

    @staticmethod
    def compute_date_features(date_obj: datetime) -> Dict[str, Any]:
        """Compute temporal features from date"""
        month = date_obj.month
        week = date_obj.isocalendar()[1]
        
        return {
            'month': month,
            'week': week,
            'day_of_week': date_obj.weekday(),
            'quarter': (month - 1) // 3 + 1,
            'year': date_obj.year,
            # Cyclic encoding
            'month_sin': np.sin(2 * np.pi * month / 12),
            'month_cos': np.cos(2 * np.pi * month / 12),
            'week_sin': np.sin(2 * np.pi * week / 52),
            'week_cos': np.cos(2 * np.pi * week / 52),
        }
    
    @staticmethod
    def compute_temperature_features(temp_celsius: float) -> Dict[str, Any]:
        """Compute temperature-based features"""
        return {
            'temp_squared': temp_celsius ** 2,
            'temp_anomaly_celsius': temp_celsius - 15.0,  # Assuming baseline of 15°C
            # Lags - set to current value (no historical data in simulation)
            'temp_lag_1w': temp_celsius,
            'temp_lag_2w': temp_celsius,
            # Rolling stats - use current value
            'temp_2w_avg': temp_celsius,
            'temp_2w_volatility': 0.0,  # No volatility in single point
            'temp_4w_volatility': 0.0,
            'temp_change_rate': 0.0,  # No change in single point
        }
    

    @staticmethod
    def compute_pm25_features(pm25: float) -> Dict[str, Any]:
        """Compute PM2.5-based features"""
        return {
            # Lags - use current value
            'pm25_ugm3_lag_1w': pm25,
            'pm25_ugm3_lag_2w': pm25,
            'pm25_ugm3_lag_4w': pm25,
            'pm25_change_rate': 0.0,  # No change in single point
        }
    

    @staticmethod
    def compute_spatial_features(lat: float, lon: float, pm25: float, temp: float) -> Dict[str, Any]:
        """Compute spatial features"""
        return {
            'latitude': lat,
            'longitude': lon,
            # Spatial lags - use current values (no neighbors in simulation)
            'spatial_lag_pm25': pm25,
            'spatial_lag_temp': temp,
            'spatial_lag_temp_anomaly': temp - 15.0,
            # Geographic indicators
            'is_northern': 1 if lat > 0 else 0,
            'is_tropical': 1 if abs(lat) < 23.5 else 0,
            'distance_to_equator': abs(lat),
        }
    
    @staticmethod
    def compute_interaction_features(pm25: float,temp: float,precip: float,healthcare: float) -> Dict[str, Any]:
        """Compute interaction features"""
        return {
            'pm25_temp_interaction': pm25 * temp,
            'temp_precip_interaction': temp * precip,
            'pm25_precip_interaction': pm25 * precip,
            'pollution_vulnerability': pm25 / (healthcare + 1e-6),
            'precip_change_rate': 0.0,  # No change in single point
        }
    
    @staticmethod
    def compute_all_features(user_input: Dict[str, Any]) -> pd.DataFrame:
        """
        Compute all required features from minimal user input
        Returns a DataFrame with all features needed by the model
        """
        # Extract user inputs
        date_obj = user_input['date']
        country_code = user_input['country_code']
        lat, lon = FeatureComputer.get_coordinates(
            country_code,
            user_input.get('latitude'),
            user_input.get('longitude')
        )
        
        temp = user_input['temperature_celsius']
        pm25 = user_input['pm25_ugm3']
        precip = user_input['precipitation_mm']
        healthcare = user_input['healthcare_access_index']
        
        # Build complete feature dictionary
        features = {
            # User-provided features
            'date': date_obj,
            'country_code': country_code,
            'temperature_celsius': temp,
            'pm25_ugm3': pm25, # 
            'precipitation_mm': precip,
            'aqi_pm': user_input['aqi_pm'],
            'healthcare_access_index': healthcare,
            'food_security_index': user_input['food_security_index'],
            'gdp_per_capita_usd': user_input['gdp_per_capita_usd'],
            'heat_wave_days': user_input['heat_wave_days'], #
            'flood_indicator': user_input['flood_indicator'],
            
            # Required by pipeline (placeholders)
            'air_quality_index': user_input['aqi_pm'],  # Use aqi_pm as proxy
            'population_millions': 100.0,  # Default placeholder
            'mental_health_index': 0.7,  # Default placeholder
            'uhs_service_coverage_index': 0.75,  # Default placeholder
            'drought_indicator': 0,
            'extreme_weather_events': user_input['heat_wave_days'] + user_input['flood_indicator'],
            
            # Categorical (placeholders - will be handled by pipeline)
            'income_level': 'High',  # Default
            'region': 'Unknown',  # Will be ignored if not in pipeline
            'country_name': country_code,  # Use code as name
            'country_id': 0,  # Placeholder
            'record_id': 0,  # Placeholder
        }
    

        # Add computed features
        features.update(FeatureComputer.compute_date_features(date_obj))
        features.update(FeatureComputer.compute_temperature_features(temp))
        features.update(FeatureComputer.compute_pm25_features(pm25))
        features.update(FeatureComputer.compute_spatial_features(lat, lon, pm25, temp))
        features.update(FeatureComputer.compute_interaction_features(pm25, temp, precip, healthcare))

        # Create DataFrame (single row)
        df = pd.DataFrame([features])
        
        return df