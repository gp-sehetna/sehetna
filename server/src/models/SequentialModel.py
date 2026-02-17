from typing import Protocol


#  This is the interface that the models will extend
#  every unique behaviour should in a seperate function
    
class SequentialModel(Protocol):
    
    def load(self):
        pass
    
    def transform(self):
        pass
    
    def forecast(self):
        pass