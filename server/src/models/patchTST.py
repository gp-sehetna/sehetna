import torch
import torch.nn as nn
from transformers import PatchTSTConfig, PatchTSTForPrediction


class PatchTST(nn.Module):
    """PatchTST model"""
    def __init__(self, config, num_features, target_indices):
        super().__init__()
        
        self.target_indices = target_indices
        
        self.model_config = PatchTSTConfig(
            num_input_channels=num_features,
            context_length=config.seq_len,
            prediction_length=config.prediction_len,
            
            d_model=config.d_model,
            n_heads=config.n_heads,
            num_hidden_layers=config.num_layers,
            
            patch_length=config.patch_len,
            stride=config.patch_stride,
            dropout=config.dropout,
            
            loss="mse"
        )

        self.model = PatchTSTForPrediction(self.model_config)

    def forward(self, x):
        """
        x: [B, T, C]
        returns: [B, num_targets]
        """
        outputs = self.model(past_values=x)
        
        # prediction_outputs: [B, 1, C]
        preds = outputs.prediction_outputs.squeeze(1)
        
        # select only target columns
        preds = preds[:, self.target_indices]
        
        return preds



