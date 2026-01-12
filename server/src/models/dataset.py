import torch
from torch.utils.data import Dataset

class ClimateHealthDataset(Dataset):
    def __init__(self, df, seq_len, countries_ids, features, targets):
        self.seq_len = seq_len
        self.samples = []

        if 'country_id' not in df.columns:
            df['country_id'] = df['country_name'].map(countries_ids)

        for c_id, country_df in df.groupby("country_id"):
            X = country_df[features].values.astype("float32")
            y = country_df[targets].values.astype("float32")
            years = country_df["year"].values

            for t in range(seq_len, len(country_df)):
                self.samples.append({"X": X[t - seq_len : t], "y": y[t], "c_id": c_id, "year": years[t]})

    def __len__(self):
        return len(self.samples)

    def __getitem__(self, idx):
        sample = self.samples[idx]

        X_num = torch.from_numpy(sample["X"]).float()
        country_id = torch.tensor(sample["c_id"], dtype=torch.long)
        y = torch.from_numpy(sample["y"]).float()

        return X_num, country_id, y

    

  