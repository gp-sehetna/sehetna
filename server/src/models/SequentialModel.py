from typing import Protocol

from config import Settings
from src.domain.schemas.predictions import PredictionResult

#  This is the interface that the models will extend
#  every unique behaviour should in a seperate function
    
class SequentialModel(Protocol):
    
    def __init__(self, settings : Settings):
        self.settings = settings

    def load(self)-> 'SequentialModel':
        pass
    

    def transform(self, predictions : list[PredictionResult]) -> 'SequentialModel':
        pass
    

    def forecast(self):
        pass

