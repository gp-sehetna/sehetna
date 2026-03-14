import numpy as np
import torch
from torch.utils.data import Dataset


class DecoderDataset(Dataset):
    """
    Sliding windows per country:
        input_seq  : X_y[k : k + SEQ_LEN]       → [SEQ_LEN, 28]  (features + targets)
        target_seq : y[k+1 : k + SEQ_LEN + 1]   → [SEQ_LEN, 5]   (targets only, shifted +1)

    min_target_idx: if set, only include windows whose last target step
                    (time_idx at position k + SEQ_LEN) > min_target_idx.
                    This allows val/test sets to draw history from earlier splits
                    while ensuring evaluation targets fall in the right period.
    """

    def __init__(self, df, seq_len, features, targets, min_target_idx=None):
        self.seq_len = seq_len
        all_cols = features + targets
        target_cols = targets
        self.samples = []

        for _, group in df.groupby("country_code"):
            group = group.sort_values("time_idx")
            data = group[all_cols].values.astype(np.float32)
            tgt = group[target_cols].values.astype(np.float32)
            tidx = group["time_idx"].values
            T = len(data)
            for k in range(T - seq_len):
                if min_target_idx is not None and tidx[k + seq_len] <= min_target_idx:
                    continue
                x = data[k : k + seq_len]
                y = tgt[k + 1 : k + seq_len + 1]
                self.samples.append((x, y))

    def __len__(self):
        return len(self.samples)

    def __getitem__(self, idx):
        x, y = self.samples[idx]
        return torch.tensor(x), torch.tensor(y)
