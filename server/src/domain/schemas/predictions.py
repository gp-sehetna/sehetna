import json
from datetime import date
from typing import Annotated, Literal

from pydantic import BaseModel, BeforeValidator, ConfigDict, Field, StringConstraints, model_validator

from src.core.exceptions import BadRequest
from src.domain.constants.aqi import BREAKPOINTS
from src.domain.helpers.aqi import aqi_to_pollutant, pollutant_to_aqi
from src.domain.types import ExplainerMethod

__all__ = ["PredictionResult", "PredictionRequest", "SimulationResponse", "EnvironmentData", "WeeklyEnvironmentData"]

with open("src/domain/schemas/examples/prediction_request.json") as f:
    prediction_request_examples = json.load(f)


class IndicatorsData(BaseModel):
    """
    Socioeconomic and nutrition indicators used as context for predictions.

    Provide any subset of fields; missing values can be null.
    """

    gdp_per_capita_usd: float | None = Field(None, description="GDP per capita in USD.")
    food_production_index: float | None = Field(None, description="Food production index value.")
    undernourishment: float | None = Field(None, description="Undernourishment prevalence (% of population).")


class WeeklyEnvironmentData(BaseModel):
    """
    Weekly environmental measurements used as model inputs.

    PM2.5 and AQI are interchangeable:
    - Provide either `pm25_ugm3` or `aqi_pm` (not both required).
    - If you provide one, the other is derived.
    """

    date: Annotated[date, Field(description="Week date in YYYY-MM-DD format.")]
    pm25_ugm3: float | None = Field(None, description="PM2.5 concentration in µg/m³.")
    aqi_pm: float | None = Field(None, description="PM2.5 AQI value.")

    temperature_celsius: float = Field(..., description="Average temperature in °C.")
    precipitation_mm: float = Field(..., description="Total precipitation in mm.")

    heat_wave_days: int = Field(0, description="Number of heat-wave days in the week.")
    flood_indicator: int = Field(0, description="Flood occurrence indicator (0/1).")

    @model_validator(mode="after")
    def validate_pm25_and_aqi(self):
        if self.pm25_ugm3 is None and self.aqi_pm is None:
            raise BadRequest("pm25_ugm3 and aqi_pm are mutually exclusive")
        if self.pm25_ugm3 is None:
            self.pm25_ugm3 = aqi_to_pollutant(BREAKPOINTS["pm25"], self.aqi_pm)
        elif self.aqi_pm is None:
            self.aqi_pm = pollutant_to_aqi(BREAKPOINTS["pm25"], self.pm25_ugm3)
        return self


class LocationData(BaseModel):
    """
    Geographic location data.

    You can provide location in either of these ways:
    - `lat` and `lon` together, and omit `coords`
    - `coords` only as a string formatted like "lat,lon"
    """

    lat: float | None = Field(None, description="Latitude in decimal degrees.")
    lon: float | None = Field(None, description="Longitude in decimal degrees.")
    coords: str | None = Field(None, description="Comma-separated coordinates: 'lat,lon'.")

    @model_validator(mode="before")
    @classmethod
    def split_coords(cls, data):
        lat = data.get("lat")
        lon = data.get("lon")
        coords = data.get("coords")

        if lat is None and lon is None and coords is None:
            raise BadRequest("lat, lon, or coords must be provided")

        if lat is not None and lon is not None:
            return data

        lat, lon = map(float, coords.split(","))
        return {**data, "lat": lat, "lon": lon}


class PredictionQueryParams(BaseModel):
    """
    Query parameters controlling prediction explanations.

    Use `top_k_contributors` to limit feature attributions and
    `explainer_method` to choose how explanations are computed.
    """

    top_k_contributors: int = Field(5, description="Number of top contributing features to return.")
    explainer_method: Annotated[ExplainerMethod, BeforeValidator(lambda v: v.lower().strip())] = Field(
        "cumulative", description="Explanation method to use."
    )


class EnvironmentData(LocationData):
    """
    Base request context combining location and country-level indicators.

    `country_code` must be a 3-letter ISO3 code, e.g. "EGY".
    """

    country_code: Annotated[
        str,
        StringConstraints(strip_whitespace=True, min_length=3, max_length=3, to_upper=True),
    ] = Field(..., description="ISO3 country code.")
    indicators: IndicatorsData = Field(..., description="Socioeconomic indicators.")


class PredictionRequest(EnvironmentData):
    """
    Full prediction request payload.

    Provide location + indicators plus a weekly `data` list of inputs.
    """

    data: list[WeeklyEnvironmentData] = Field(
        ...,
        description="Weekly feature inputs for prediction.",
    )

    model_config = ConfigDict(json_schema_extra={"examples": prediction_request_examples})


class PredictionResult(BaseModel):
    """
    Prediction outputs and explanation payload.

    `explanations` includes the chosen method and the corresponding data.
    """

    respiratory_disease_rate: float = Field(..., description="Predicted respiratory disease rate.")
    cardio_mortality_rate: float = Field(..., description="Predicted cardiovascular mortality rate.")
    vector_disease_risk_score: float = Field(..., description="Predicted vector-borne disease risk score.")
    waterborne_disease_incidents: int = Field(..., description="Predicted count of waterborne disease incidents.")
    heat_related_admissions: int = Field(..., description="Predicted heat-related hospital admissions.")

    @classmethod
    def from_prediction(cls, prediction: list[float]):
        return cls(
            respiratory_disease_rate=prediction[0],
            cardio_mortality_rate=prediction[1],
            vector_disease_risk_score=prediction[2],
            waterborne_disease_incidents=round(prediction[3]),
            heat_related_admissions=round(prediction[4]),
        )

    # @classmethod
    # def from_predictions(cls, method: ExplainerMethod, predictions, data: dict[str, list] | None = None):
    #     return cls(
    #         respiratory_disease_rate=float(predictions[0]),
    #         cardio_mortality_rate=float(predictions[1]),
    #         vector_disease_risk_score=float(predictions[2]),
    #         waterborne_disease_incidents=round(predictions[3]),
    #         heat_related_admissions=round(predictions[4]),
    #         explanations={"method": method, method: data},
    #     )

    #     # Convert each model's predictions to floats
    #     model_preds = list(predictions.values())
    
    #     # Simple aggregation: average across models for each outcome
    #     aggregated = [sum(x) / len(x) for x in zip(*model_preds)]

    #     return cls(
    #         respiratory_disease_rate=float(aggregated[0]),
    #         cardio_mortality_rate=float(aggregated[1]),
    #         vector_disease_risk_score=float(aggregated[2]),
    #         waterborne_disease_incidents=round(aggregated[3]),
    #         heat_related_admissions=round(aggregated[4]),
    #         explanations={"method": method, method: explanation_data},
    #     )
    def from_predictions(cls, predictions: list[list[float]]):
        return [cls.from_prediction(prediction) for prediction in predictions]


class SimulationResponse(BaseModel):
    """
    Response wrapper for prediction endpoints.
    """

    explanations: dict[ExplainerMethod | Literal["method"], ExplainerMethod | dict[str, list] | None] = Field(
        ..., description="Model explanation payload and metadata."
    )
    predictions: list[PredictionResult] = Field(..., description="Predicted health outcomes.")

    @classmethod
    def build(cls, predictions: list[list[float]], method: ExplainerMethod, explanations: dict[str, list] | None):
        return cls(
            predictions=PredictionResult.from_predictions(predictions),
            explanations={"method": method, method: explanations},
        )


