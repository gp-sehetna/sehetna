from pydantic import BaseModel, Field


class SimulationOutcomes(BaseModel):
    """The 5 health outcomes produced by the LGBM simulation."""
 
    respiratory_disease_rate: float = Field(
        ..., description="Predicted respiratory disease rate."
    )
    cardio_mortality_rate: float = Field(
        ..., description="Predicted cardiovascular mortality rate."
    )
    vector_disease_risk_score: float = Field(
        ..., description="Predicted vector-borne disease risk score."
    )
    waterborne_disease_incidents: int = Field(
        ..., description="Predicted count of waterborne disease incidents."
    )
    heat_related_admissions: int = Field(
        ..., description="Predicted heat-related hospital admissions."
    )


# ---------------------------------------------------------------------------
# Request
# ---------------------------------------------------------------------------
 
class InterpretationRequest(BaseModel):
    """Request schema for the interpreter agent."""

    country: str = Field(
        ...,
        description="Country name or ISO3 code the simulation was run for.",
    )
    simulation_outcomes: SimulationOutcomes = Field(
        ...,
        description="The 5 health-outcome predictions from the LGBM model.",

    )

    environmental_data: list[dict] = Field(
        ...,
        description=(
            "List of environmental parameter dictionaries (e.g. multiple scenarios "
            "with temperature, PM2.5, AQI, humidity…)."
    ),
    )

    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "country": "Egypt",
                    "simulation_outcomes": {
                        "respiratory_disease_rate": 14.7,
                        "cardio_mortality_rate": 8.2,
                        "vector_disease_risk_score": 3.5,
                        "waterborne_disease_incidents": 120,
                        "heat_related_admissions": 340,
                    },
                      "environmental_data": [
                        {
                            "temperature": 30,
                            "pm25": 80,
                            "aqi": 150,
                            "humidity": 60
                        },
                        {
                            "temperature": 25,
                            "pm25": 40,
                            "aqi": 90,
                            "humidity": 50
                        }
                    ]
                }
            ]
        }
    }

      
# ---------------------------------------------------------------------------
# Response
# ---------------------------------------------------------------------------
 
class InterpretationResponse(BaseModel):
    """Response schema returned by the interpreter agent."""
 
    message: str = Field(
        ...,
        description="Human-readable interpretation of the prediction results",
    )

