from enum import StrEnum

from pydantic import BaseModel, Field


class SeverityLevel(StrEnum):
    low = "low"
    medium = "medium"
    high = "high"
    critical = "critical"


class InterpretationResult(BaseModel):
    """Structured public-health interpretation for UI rendering."""

    message: str = Field(description="A short, plain-language explanation for a non-technical user.")
    severity: SeverityLevel = Field(
        description=(
            "Overall UI severity level. "
            "Use low for manageable conditions, medium for noticeable concern, "
            "high for serious concern, and critical for urgent risk."
        )
    )
