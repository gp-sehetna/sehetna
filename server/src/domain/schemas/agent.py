from pydantic import BaseModel, Field

from src.domain.schemas.predictions import PredictionResult

# ---------------------------------------------------------------------------
# Request
# ---------------------------------------------------------------------------


class InterpretationRequest(BaseModel):
    """Request schema for the interpreter agent."""

    country: str = Field(..., description="Country name or ISO3 code the simulation was run for.")
    simulation_outcomes: PredictionResult = Field(..., description="The 5 health-outcome predictions from the LGBM model.")

    environmental_data: list[dict] = Field(
        ...,
        description=(
            "List of environmental parameter dictionaries (e.g. multiple scenarios " "with temperature, PM2.5, AQI, humidity…)."
        ),
    )


# ---------------------------------------------------------------------------
# Response
# ---------------------------------------------------------------------------


class InterpretationResponse(BaseModel):
    """Response schema returned by the interpreter agent."""

    message: str = Field(..., description="Human-readable interpretation of the prediction results")
