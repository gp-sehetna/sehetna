import torch
import joblib
import pickle
import logging
import os
from ...config import Settings
from types import SimpleNamespace

logger = logging.getLogger(__name__)

# class ModelLoader:
#     def __init__(self):
#         self.model: torch.nn.Module = None
#         self.pipeline = None
#         self.y_scaler = None
#         self.country_to_idx = None
#         self.idx_to_country = None
#         self.feature_names = None
#         self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        
#         logger.info(f"Using device: {self.device}")
        
#     def __call__(self, settings: Settings):
#         try:
#             # ✅ Log paths before loading
#             logger.info("=== Loading model artifacts ===")
#             logger.info(f"MODEL_PATH={settings.MODEL_PATH}")
#             logger.info(f"PIPELINE_PATH={settings.PIPELINE_PATH}")
#             logger.info(f"Y_SCALER_PATH={settings.Y_SCALER_PATH}")
#             logger.info(f"COUNTRY_TO_IDX_PATH={settings.COUNTRY_TO_IDX_PATH}")
#             logger.info(f"IDX_TO_COUNTRY_PATH={settings.IDX_TO_COUNTRY_PATH}")
            
#             # Load model
#             with open(settings.MODEL_PATH, "rb") as f:
#                 self.model = pickle.load(f).to(self.device).eval()
#             # Load pipeline and scalers
#             self.load_pipeline(settings.PIPELINE_PATH)
#             self.load_y_scaler(settings.Y_SCALER_PATH)
#             self.country_to_idx(settings.COUNTRY_TO_IDX_PATH)
#             self.idx_to_country(settings.IDX_TO_COUNTRY_PATH)

#             logger.info("All artifacts loaded successfully")
#         except Exception as e:
#             logger.error(f"Error loading artifacts: {e}")
        
#     # Load model
#     def load_model(self, path: str):
#         with open(path, 'rb') as file:
#             self.model = pickle.load(file).to(self.device).eval()
#         logger.info(f"Loaded model from {path}")

#     def load_y_scaler(self, path: str):
#         self.y_scaler = joblib.load(path)
        
#         logger.info(f"Loaded y_scaler from {path}")
        
#     def load_pipeline(self, path: str):
#         self.pipeline = joblib.load(path)
        
#         logger.info(f"Loaded pipeline from {path}")

#     def load_feature_names(self, path: str):
#         self.feature_names = joblib.load(path)
        
#         logger.info(f"Loaded feature names from {path}")


class ModelLoader:
    def __init__(self):
        self.model: torch.nn.Module = None
        self.pipeline = None
        self.y_scaler = None
        self.country_to_idx = None
        self.idx_to_country = None
        self.feature_names = None
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        logger.info(f"Using device: {self.device}")

    def __call__(self, settings: Settings):
        try:
            logger.info("=== Loading model artifacts ===")
            logger.info(f"MODEL_PATH={settings.MODEL_PATH}")
            logger.info(f"PIPELINE_PATH={settings.PIPELINE_PATH}")
            logger.info(f"Y_SCALER_PATH={settings.Y_SCALER_PATH}")
            logger.info(f"COUNTRY_TO_IDX_PATH={settings.COUNTRY_TO_IDX_PATH}")
            logger.info(f"IDX_TO_COUNTRY_PATH={settings.IDX_TO_COUNTRY_PATH}")

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
            self.load_model(settings.MODEL_PATH ,test_config )
            # Load pipeline and scalers
            self.load_pipeline(settings.PIPELINE_PATH)
            self.load_y_scaler(settings.Y_SCALER_PATH)
            self.load_country_to_idx(settings.COUNTRY_TO_IDX_PATH)
            self.load_idx_to_country(settings.IDX_TO_COUNTRY_PATH)

            logger.info("All artifacts loaded successfully")
        except Exception as e:
            logger.exception("Failed to load model/pipeline")
            raise e

    def load_model(self, path: str, config: SimpleNamespace):
        """Load PatchTST model from pickle checkpoint"""

        with open(path, 'rb') as f:
            checkpoint = pickle.load(f)
        
        # Extract state dict (handle both formats)
        if isinstance(checkpoint, dict) and 'model_state_dict' in checkpoint:
            state_dict = checkpoint['model_state_dict']
        else:
            state_dict = checkpoint
        
        
        # Import PatchTST model
        from .patchTST import PatchTST
        
        
        # Initialize model
        self.model = PatchTST(
            config=config,
            num_features=len(self.features),
            target_indices=self.target_indices
        )
        
        # Load weights
        self.model.load_state_dict(state_dict)
        self.model.to(self.device)
        self.model.eval()
        
        logger.info(f"Loaded PatchTST model from {path}")
        

    def load_pipeline(self, path: str):
        self.pipeline = joblib.load(path)
        logger.info(f"Loaded pipeline from {path}")

    def load_y_scaler(self, path: str):
        self.y_scaler = joblib.load(path)
        logger.info(f"Loaded y_scaler from {path}")

    def load_country_to_idx(self, path: str):
        self.country_to_idx = joblib.load(path)
        logger.info(f"Loaded country_to_idx from {path}")

    def load_idx_to_country(self, path: str):
        self.idx_to_country = joblib.load(path)
        logger.info(f"Loaded idx_to_country from {path}")


# Global instance
model_loader = ModelLoader()
