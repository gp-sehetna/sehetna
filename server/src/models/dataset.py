import torch
from torch.utils.data import Dataset
import numpy as np
import pandas as pd


class ClimateHealthDataset(Dataset):
    """Custom Dataset for Climate Health temporal data"""
    def __init__(self, df, seq_len=12):
        self.df = df.sort_values(['country_id', 'date']).reset_index(drop=True)
        self.seq_len = seq_len

        # Identify feature columns (exclude targets and identifiers)
        self.target_cols = [
            'respiratory_disease_rate',
            'cardio_mortality_rate', 
            'vector_disease_risk_score',
            'waterborne_disease_incidents',
            'heat_related_admissions'
        ]

        self.id_cols = ['record_id', 'country_id', 'date']
        self.feature_cols = [col for col in df.columns if col not in self.target_cols + self.id_cols]

        self.sequences = self.build_sequences()
         
    def _build_sequences(self):
        sequences = []
        grouped = self.df.groupby('country_id')
        
        for country_id, group in grouped:
            group = group.sort_values('date').reset_index(drop=True)
            
            for i in range(len(group) - self.seq_len + 1):
                seq_data = group.iloc[i:i + self.seq_len]
                
                sequences.append({
                    'features': seq_data[self.feature_cols].values.astype(np.float32),
                    'country_id': country_id,
                    'targets': seq_data[self.target_cols].iloc[-1].values.astype(np.float32),
                    'date': seq_data['date'].iloc[-1]
                })
        
        return sequences
    
    def __len__(self):
        return len(self.sequences)
    
    def __getitem__(self, idx):
        item = self.sequences[idx]
        return (
            torch.FloatTensor(item['features']),
            torch.LongTensor([item['country_id']]),
            torch.FloatTensor(item['targets'])
        )


    

  