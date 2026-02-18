import logging

from src.domain.schemas.predictions import PredictionResult
from src.domain.schemas.sequential_schemas import ForecastRequest
from src.models.ForecastModelFactory import ForecastModelFactory

logger = logging.getLogger(__name__)

class SequentialForecastService:
    """
    
        1- call the factory
        
            2- load
        
                3- forecast
    
    """
    def __init__(self, settings):
        self.settings = settings

    
    
    def forecast(self, req: ForecastRequest, predictions : list[PredictionResult]):
        
        """ call forecast method of the passd model """
        model_id = req.model_id
        model_class = ForecastModelFactory(self.settings)
        
        model = model_class.getInstance(model_id)
        return model.load().transform(predictions).forecast() 
        
        


    