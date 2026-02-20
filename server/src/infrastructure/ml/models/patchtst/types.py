import torch
from transformers.utils.generic import ModelOutput


class PatchTSTForPredictionOutput(ModelOutput):
    loss: torch.FloatTensor | None = None
    prediction_outputs: torch.FloatTensor | None = None
    hidden_states: tuple[torch.FloatTensor] | None = None
    attentions: tuple[torch.FloatTensor] | None = None
    loc: torch.FloatTensor | None = None
    scale: torch.FloatTensor | None = None
