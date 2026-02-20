import pandas as pd
import torch
from torch.utils.data import Dataset


class ClimateHealthDataset(Dataset):
    def __init__(self, df: pd.DataFrame, targets: list[str], seq_len=12):
        self.samples = []

        df = df.copy()

        # for _, country_df in df.groupby("country_id"):  # Each country_df.shape[0] = ~522
        #     country_df = country_df.sort_values("date").reset_index(drop=True)

        y = df[targets].values.astype("float32")

        max_t = len(df)

        for t in range(seq_len, max_t):
            self.samples.append({"y_past": y[t - seq_len : t]})

    def __len__(self):
        return len(self.samples)

    def __getitem__(self, idx):
        """
        ## Shapes returned
        - y_past   : [seq_len, num_targets]
        """
        s = self.samples[idx]
        return torch.from_numpy(s["y_past"])
