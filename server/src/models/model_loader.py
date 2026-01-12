import torch
import joblib
import pickle
import logging
import os
from ...config import Settings
from types import SimpleNamespace

logger = logging.getLogger(__name__)


class ModelLoader:
    def __init__(self):
        self.model: torch.nn.Module = None
        self.pipeline = None
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        logger.info(f"Using device: {self.device}")

    def __call__(self, settings: Settings):
        logger.info("=== Loading model artifacts ===")
        logger.info(f"MODEL_PATH={settings.model_path}")
        logger.info(f"PIPELINE_PATH={settings.pipeline_path}")

        # Load model
        test_config = SimpleNamespace(
            batch_size=128,
            d_model=128,
            dropout=0.1883665437626323,
            e=32,
            k=1,
            lr=0.009707265376473876,
            min_train_years=8,
            n_heads=4,
            num_layers=3,
            patch_len=6,
            patch_stride=2,
            prediction_len=1,
            scheduler=False,
            seq_len=8,
            test_years=1,
            val_years=1,
            weight_decay=0.03831498090798732,
        )

        self.load_model(settings.model_path, test_config)
        self.load_pipeline(settings.pipeline_path)

        logger.info("All artifacts loaded successfully")

    def load_model(self, path: str, config: SimpleNamespace):
        """Load PatchTST model from pickle checkpoint"""

        with open(path, "rb") as f:
            checkpoint = pickle.load(f)

        # Extract state dict (handle both formats)
        if isinstance(checkpoint, dict) and "model_state_dict" in checkpoint:
            state_dict = checkpoint["model_state_dict"]
        else:
            state_dict = checkpoint

        # Import PatchTST model
        from .patchTST import PatchTST

        # Initialize model
        self.model = PatchTST(
            config=config,
            num_features=len(self.features),
            target_indices=self.target_indices,
        )

        # Load weights
        self.model.load_state_dict(state_dict)
        self.model.to(self.device)
        self.model.eval()

        logger.info(f"Loaded PatchTST model from {path}")

    def load_pipeline(self, path: str):
        self.pipeline = joblib.load(path)
        logger.info(f"Loaded pipeline from {path}")

# Global instance
model_loader = ModelLoader()
