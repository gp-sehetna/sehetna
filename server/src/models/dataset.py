import torch
from torch.utils.data import Dataset
import numpy as np
import pandas as pd


# class ClimateHealthDataset(Dataset):
#     """Custom Dataset for Climate Health temporal data"""
#     def __init__(self, df, seq_len=24):
#         self.df = df.sort_values(['country_id', 'date']).reset_index(drop=True)
#         self.seq_len = seq_len

#         # Identify feature columns (exclude targets and identifiers)
#         self.target_cols = [
#             'respiratory_disease_rate',
#             'cardio_mortality_rate', 
#             'vector_disease_risk_score',
#             'waterborne_disease_incidents',
#             'heat_related_admissions'
#         ]

#         self.id_cols = ['record_id', 'country_id', 'date']
#         self.feature_cols = [col for col in df.columns if col not in self.target_cols + self.id_cols]

#         self.sequences = self.build_sequences()
         
#     def _build_sequences(self):
#         sequences = []
#         grouped = self.df.groupby('country_id')
        
#         for country_id, group in grouped:
#             group = group.sort_values('date').reset_index(drop=True)
            
#             for i in range(len(group) - self.seq_len + 1):
#                 seq_data = group.iloc[i:i + self.seq_len]
                
#                 sequences.append({
#                     'features': seq_data[self.feature_cols].values.astype(np.float32),
#                     'country_id': country_id,
#                     'targets': seq_data[self.target_cols].iloc[-1].values.astype(np.float32),
#                     'date': seq_data['date'].iloc[-1]
#                 })
        
#         return sequences
    
#     def __len__(self):
#         return len(self.sequences)
    
#     def __getitem__(self, idx):
#         item = self.sequences[idx]
#         return (
#             torch.FloatTensor(item['features']),
#             torch.LongTensor([item['country_id']]),
#             torch.FloatTensor(item['targets'])
#         )
class ClimateHealthDataset(Dataset):
    def __init__(self, df, seq_len, countries_ids, features, targets):
        self.seq_len = seq_len
        self.samples = []

        # Ensure country_id exists
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

    

  