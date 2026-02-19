from abc import ABC, abstractmethod

from config import Settings


class SequentialModel(ABC):
    """
    This is the interface that the models will extend
    every unique behaviour should in a seperate function
    """

    def __init__(self, settings: Settings):
        self.settings = settings

    @abstractmethod
    def load(self) -> "SequentialModel": ...

    @abstractmethod
    def transform(self, predictions: list[list[float]]) -> "SequentialModel": ...

    @abstractmethod
    def forecast(self): ...
