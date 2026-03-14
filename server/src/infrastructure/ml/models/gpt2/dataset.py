import numpy as np
import pandas as pd
import torch
from torch.utils.data import Dataset


class DecoderDataset(Dataset):
    """
    Same sliding window logic as DecoderDataset but no target shifting.
    x : data[k : k + seq_len]  → [SEQ_LEN, F+T]   (features + past targets as context)
    """

    def __init__(self, df: pd.DataFrame, seq_len: int, features: list[str], targets: list[str]):
        self.samples: list[np.ndarray] = []

        data = df[features + targets].values.astype("float32")

        for k in range(len(data) - seq_len):
            self.samples.append(data[k : k + seq_len])

    def __len__(self):
        return len(self.samples)

    def __getitem__(self, idx):
        return torch.tensor(self.samples[idx])
