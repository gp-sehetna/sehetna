from src.core.exceptions import NotFound
from src.models.PatchTST_model.patchTST_model import PatchTST
from src.models.SequentialModel import SequentialModel


class ForecastModelFactory:
    def __init__(self , settings):
        self._model_cache : dict[str, SequentialModel] = {}
        self._model_factories : dict[str, type[SequentialModel]] = {
            "patchtst": PatchTST,
            # "timesfm": TimesFM,
        }

        self.settings = settings

    def getInstance(self, model_id):
        if model_id not in self._model_factories:
            raise NotFound(f"Unknown model_id: {model_id}. Available models: {list(self._model_factories.keys())}") 
        
        if model_id not in self._model_cache:
            model = self._model_factories[model_id](self.settings)
            self._model_cache[model_id] = model
            
        return self._model_cache[model_id]
    

    
