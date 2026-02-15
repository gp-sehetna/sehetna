from torch.utils.data import DataLoader, Dataset
import torch

class ClimateHealthDataset(Dataset):
    def __init__(self, df,targets , countries_ids ,seq_len=12, horizon_len=6 ):
        self.samples = []

        df = df.copy()
        df["country_id"] = df["country_name"].map(countries_ids)

        for _, country_df in df.groupby("country_id"): # Each country_df.shape[0] = ~522
            country_df = country_df.sort_values("date").reset_index(drop=True)

            y = df[targets].values.astype("float32")
    
            max_t = len(df) - horizon_len # 522 - 6 = 516

            for t in range(seq_len, max_t):
                self.samples.append({"y_past":   y[t - seq_len : t], "y_future": y[t : t + horizon_len]})

    def __len__(self):
        return len(self.samples)


    def __getitem__(self, idx):
        """
        ## Shapes returned
        - y_past   : [seq_len, num_targets]
        - y_future : [horizon_len, num_targets]

        :param idx: Index of the current batch
        """
        s = self.samples[idx]
        return torch.from_numpy(s["y_past"]), torch.from_numpy(s["y_future"])