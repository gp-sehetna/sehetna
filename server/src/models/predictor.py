import logging

import numpy as np
import pandas as pd

from src.models import model_loader
from src.schema import HealthDataInput, PredictionResult

logger = logging.getLogger(__name__)


class Predictor:
    @staticmethod
    def simulate(user_input: HealthDataInput):
        df = pd.DataFrame([user_input.__dict__])
        df_processed = model_loader.pipeline.transform(df)
        X_pred = df_processed[model_loader.features]

        # Model here is a list of multiple MultiOutput LGBM regressors
        # so we need to average their predictions (ensembling)
        predictions = np.mean([m.predict(X_pred) for m in model_loader.model], axis=0)
        _values = predictions[0]

        return PredictionResult(
            respiratory_disease_rate=float(_values[0]),
            cardio_mortality_rate=float(_values[1]),
            vector_disease_risk_score=float(_values[2]),
            waterborne_disease_incidents=float(_values[3]),
            heat_related_admissions=float(_values[4]),
        )
