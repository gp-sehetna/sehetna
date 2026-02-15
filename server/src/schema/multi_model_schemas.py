from pydantic import BaseModel , Field
class ModelPredictionWithUncertainty(BaseModel):
    """Individual model prediction for all health outcomes with uncertainty estimates."""
    # Mean predictions
    respiratory_disease_rate: float = Field(..., description="Predicted respiratory disease rate.")
    cardio_mortality_rate: float = Field(..., description="Predicted cardiovascular mortality rate.")
    vector_disease_risk_score: float = Field(..., description="Predicted vector-borne disease risk score.")
    waterborne_disease_incidents: int = Field(..., description="Predicted count of waterborne disease incidents.")
    heat_related_admissions: int = Field(..., description="Predicted heat-related hospital admissions.")  
    # Uncertainty estimates (standard deviation from overlapping predictions)
    respiratory_disease_rate_std: float | None = Field(None, description="Standard deviation for respiratory disease rate.")
    cardio_mortality_rate_std: float | None = Field(None, description="Standard deviation for cardio mortality rate.")
    vector_disease_risk_score_std: float | None = Field(None, description="Standard deviation for vector disease risk.")
    waterborne_disease_incidents_std: float | None = Field(None, description="Standard deviation for waterborne incidents.")
    heat_related_admissions_std: float | None = Field(None, description="Standard deviation for heat admissions.")
class ModelPrediction(BaseModel):
    """Individual model prediction for all health outcomes (simple version without uncertainty).""" 
    respiratory_disease_rate: float = Field(..., description="Predicted respiratory disease rate.")
    cardio_mortality_rate: float = Field(..., description="Predicted cardiovascular mortality rate.")
    vector_disease_risk_score: float = Field(..., description="Predicted vector-borne disease risk score.")
    waterborne_disease_incidents: int = Field(..., description="Predicted count of waterborne disease incidents.")
    heat_related_admissions: int = Field(..., description="Predicted heat-related hospital admissions.")
class MultiModelPredictionResult(BaseModel):
    """
    Prediction results from multiple models without aggregation.
    Returns separate predictions from each model with optional uncertainty estimates.
    """
    timesfm: ModelPrediction = Field(..., description="Predictions from TimesFM model.")
    patchtst: ModelPredictionWithUncertainty = Field(..., description="Predictions from PatchTST model with uncertainty.")
    @classmethod
    def from_model_predictions(
        cls, 
        predictions: dict[str, list[float]],
        uncertainty: dict[str, list[float]] | None = None
    ):
        """
        Create result from raw model predictions.
        Args:
            predictions: Dictionary with model names as keys and prediction lists as values
                Example: {
                    'timesfm': [12.5, 8.3, 0.45, 15.0, 23.0],
                    'patchtst': [11.8, 7.9, 0.42, 14.0, 22.0]
                }
            uncertainty: Optional dictionary with model names as keys and std dev lists as values
                Example: {
                    'patchtst': [0.5, 0.3, 0.02, 1.0, 2.0]
                }
        Returns:
            MultiModelPredictionResult with predictions from both models
        """
        timesfm_preds = predictions.get('timesfm', [0.0] * 5)
        patchtst_preds = predictions.get('patchtst', [0.0] * 5)
        # Get uncertainty estimates if available
        patchtst_std = None
        if uncertainty and 'patchtst' in uncertainty:
            patchtst_std = uncertainty['patchtst']
        # Create TimesFM prediction (no uncertainty)
        timesfm_prediction = ModelPrediction(
            respiratory_disease_rate=float(timesfm_preds[0]),
            cardio_mortality_rate=float(timesfm_preds[1]),
            vector_disease_risk_score=float(timesfm_preds[2]),
            waterborne_disease_incidents=round(timesfm_preds[3]),
            heat_related_admissions=round(timesfm_preds[4]),
        )
        # Create PatchTST prediction with uncertainty
        patchtst_prediction = ModelPredictionWithUncertainty(
            respiratory_disease_rate=float(patchtst_preds[0]),
            cardio_mortality_rate=float(patchtst_preds[1]),
            vector_disease_risk_score=float(patchtst_preds[2]),
            waterborne_disease_incidents=round(patchtst_preds[3]),
            heat_related_admissions=round(patchtst_preds[4]),
            respiratory_disease_rate_std=float(patchtst_std[0]) if patchtst_std else None,
            cardio_mortality_rate_std=float(patchtst_std[1]) if patchtst_std else None,
            vector_disease_risk_score_std=float(patchtst_std[2]) if patchtst_std else None,
            waterborne_disease_incidents_std=float(patchtst_std[3]) if patchtst_std else None,
            heat_related_admissions_std=float(patchtst_std[4]) if patchtst_std else None,
        )
        return cls(
            timesfm=timesfm_prediction,
            patchtst=patchtst_prediction
        )
    
class ForecastResponse(BaseModel):
    """Response wrapper for forecast endpoint."""
    
    predictions: MultiModelPredictionResult = Field(
        ..., 
        description="Predictions from both TimesFM and PatchTST models."
    )