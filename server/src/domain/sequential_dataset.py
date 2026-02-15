from torch.utils.data import Dataset
import numpy as np
import torch

class SequentialDataset(Dataset):
    """
    Simplified dataset without DataLoader overhead for small test datasets.
    Directly processes the data without batching complexity.
    """

    def __init__(self, y_data, seq_len=12, horizon_len=6):
        """
        Initialize simplified dataset.
        
        Args:
            y_data: numpy array of shape [total_timesteps, num_targets]
            seq_len: Length of input sequence
            horizon_len: Length of prediction horizon
        """
        self.samples = []
        self.seq_len = seq_len
        self.horizon_len = horizon_len
        
        total_len = len(y_data)
        transition_point = total_len - horizon_len


        # Normal samples with full future
        for t in range(seq_len, transition_point + 1):
            y_past = y_data[t - seq_len: t]
            y_future = y_data[t: t + horizon_len]
            
            self.samples.append({
                "y_past": y_past,
                "y_future": y_future,
                "future_length": horizon_len
            })

        
        # Samples with decreasing future lengths
        for t in range(transition_point + 1, total_len):
            y_past = y_data[t - seq_len: t]
            remaining_future = total_len - t
            
            if remaining_future > 0:
                y_future = y_data[t: t + remaining_future]
                padding = np.zeros((horizon_len - remaining_future, y_data.shape[1]), dtype=np.float32)
                y_future_padded = np.vstack([y_future, padding])
            else:
                y_future_padded = np.zeros((horizon_len, y_data.shape[1]), dtype=np.float32)
            
            self.samples.append({
                "y_past": y_past,
                "y_future": y_future_padded,
                "future_length": remaining_future
            })

    def __len__(self):
        return len(self.samples)
    
    def __getitem__(self, idx):
        s = self.samples[idx]
        return torch.from_numpy(s["y_past"]), torch.from_numpy(s["y_future"])
    

    def get_all_batched(self):
        """
        Get all samples as a single batch.
        
        Returns:
            tuple: (y_past_batch, y_future_batch)
                - y_past_batch: [num_samples, seq_len, num_targets]
                - y_future_batch: [num_samples, horizon_len, num_targets]
        """
        y_past_list = []
        y_future_list = []
        
        for sample in self.samples:
            y_past_list.append(torch.from_numpy(sample["y_past"]))
            y_future_list.append(torch.from_numpy(sample["y_future"]))
        
        return torch.stack(y_past_list), torch.stack(y_future_list)