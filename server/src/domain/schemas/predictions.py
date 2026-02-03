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
    gdp_per_capita_usd: float | None = None
    food_production_index: float | None = None
    undernourishment: float | None = None


class WeeklyEnvironmentData(BaseModel):
    date: Annotated[date, Field(description="Date in YYYY-MM-DD format")]
    pm25_ugm3: float | None = None
    aqi_pm: float | None = None

    temperature_celsius: float
    precipitation_mm: float

    heat_wave_days: int = 0
    flood_indicator: int = 0

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
    lat: float
    lon: float

    @model_validator(mode="before")
    @classmethod
    def split_coords(cls, data):
        if not isinstance(data, dict) or "coords" not in data:
            return data

        coords = data.pop("coords")
        if not isinstance(coords, str):
            return data

        lat, lon = map(float, coords.split(","))
        data["lat"] = lat
        data["lon"] = lon
        return data


class PredictionQueryParams(BaseModel):
    top_k_contributors: int = 5
    explainer_method: Annotated[ExplainerMethod, BeforeValidator(lambda v: v.lower().strip())] = "cumulative"


class EnvironmentData(LocationData):
    country_code: Annotated[str, StringConstraints(strip_whitespace=True, min_length=3, max_length=3, to_upper=True)]
    indicators: IndicatorsData


class PredictionRequest(EnvironmentData):
    data: list[WeeklyEnvironmentData] = Field(
        ...,
        description="Feature input values for prediction.",
    )

    model_config = ConfigDict(json_schema_extra={"examples": prediction_request_examples})


class PredictionResult(BaseModel):
    respiratory_disease_rate: float
    cardio_mortality_rate: float
    vector_disease_risk_score: float
    waterborne_disease_incidents: int
    heat_related_admissions: int

    explanations: dict[ExplainerMethod | Literal["method"], ExplainerMethod | dict[str, list] | None]

    @classmethod
    def from_predictions(cls, method: ExplainerMethod, predictions, data: dict[str, list] | None = None):
        return cls(
            respiratory_disease_rate=float(predictions[0]),
            cardio_mortality_rate=float(predictions[1]),
            vector_disease_risk_score=float(predictions[2]),
            waterborne_disease_incidents=round(predictions[3]),
            heat_related_admissions=round(predictions[4]),
            explanations={"method": method, method: data},
        )


class SimulationResponse(BaseModel):
    predictions: PredictionResult = Field(..., description="Predicted health outcomes")
