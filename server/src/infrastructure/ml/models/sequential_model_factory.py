from config import Settings
from src.core.exceptions import NotFound
from src.infrastructure.ml.model_loader import ModelLoader
from src.infrastructure.ml.models.gpt2.model import GPT2Forecaster
from src.infrastructure.ml.models.patchtst.model import PatchTST
from src.infrastructure.ml.models.sequential_model import SequentialModel
from src.infrastructure.ml.models.timesfm.model import TimesFM


class SequentialModelFactory:
    def __init__(self, settings: Settings, model_loader: ModelLoader):
        self._model_cache: dict[str, SequentialModel] = {}
        self._model_factories: dict[str, type[SequentialModel]] = {
            "patchtst": PatchTST,
            "timesfm": TimesFM,
            "gpt2-forecaster": GPT2Forecaster,
        }

        self.settings = settings
        self.model_loader = model_loader

    def get_instance(self, model_id):
        if model_id not in self._model_factories:
            raise NotFound(f"Unknown model_id: {model_id}. Available models: {list(self._model_factories.keys())}")

        if model_id not in self._model_cache:
            model = self._model_factories[model_id](self.settings, self.model_loader)
            self._model_cache[model_id] = model

        return self._model_cache[model_id]
