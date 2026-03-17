import numpy as np
import pandas as pd
import torch
from torch.utils.data import Dataset


class SlidingWindowDataset(Dataset):
    """
    Generic sliding window dataset.

    For each valid offset k, produces a window of shape [seq_len, num_cols].
    """

    def __init__(self, df: pd.DataFrame, seq_len: int, cols: list[str] | None = None, offset: int = 0):
        """
        Args:
            df:       Source DataFrame.
            seq_len:  Number of timesteps per window.
            cols:     Columns to include (in order). Defaults to all columns.
            offset:   Start index of the window relative to k (default 0).                                                                                                                                                                                                                                                           Use offset=-seq_len for a look-back window ending at k.
        """
        cols = cols or df.columns.tolist()
        data = df[cols].values.astype("float32")

        self.seq_len = seq_len
        self.cols = cols

        start = max(0, -offset)
        end = len(data) - seq_len - max(0, offset)

        self.samples: list[np.ndarray] = [data[k + offset : k + offset + seq_len] for k in range(start, end)]

    def __len__(self) -> int:
        return len(self.samples)

    def __getitem__(self, idx: int) -> torch.Tensor:
        return torch.from_numpy(self.samples[idx])
