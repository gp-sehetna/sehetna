
from typing import Protocol


class _Predictor(Protocol):
    def predict(self, series, horizon):
        ...


class ModelOrchestrator:
    def __init__(self, timesfm: _Predictor | None = None, patchtst: _Predictor | None = None):
        self.timesfm = timesfm
        self.patchtst = patchtst

    def run(self, series, horizon):
        if self.timesfm is None or self.patchtst is None:
            raise ValueError("TimesFM and PatchTST models must be provided.")

        results: dict[str, list] = {}

        timesfm_pred = self.timesfm.predict(series, horizon)
        patchtst_pred = self.patchtst.predict(series, horizon)

        results["timesfm"] = list(timesfm_pred)
        results["patchtst"] = list(patchtst_pred)

        return results

