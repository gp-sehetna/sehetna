from datetime import timedelta
import pandas as pd
import logging
import torch
from types import SimpleNamespace

logger = logging.getLogger(__name__)
def generate_future_dates(start_date, num_weeks):
    """
    Generate list of future dates for weekly predictions.
    
    Args:
        start_date: Starting date
        num_weeks: Number of weeks to generate
    
    Returns:
        List of dates
    """
    dates = []
    for i in range(num_weeks):
        dates.append(start_date + timedelta(weeks=i))
    return dates


def combine_data(
        self,
        original_df: pd.DataFrame,
        filled_df: pd.DataFrame,
        last_test_date
    ) -> pd.DataFrame:
        """
        Combine original data (up to last_test_date) with LightGBM filled data.
        
        Args:
            original_df: Original data up to last_test_date
            filled_df: LightGBM filled data after last_test_date
            last_test_date: Boundary date
        
        Returns:
            Complete historical DataFrame
        """
        logger.info("Combining original + filled data...")
        
        # Filter original data up to last_test_date
        original_filtered = original_df[original_df['date'] <= pd.Timestamp(last_test_date)].copy()
        
        # Concatenate
        complete_df = pd.concat([original_filtered, filled_df], ignore_index=True)
        complete_df = complete_df.sort_values('date').reset_index(drop=True)
        
        logger.info(f"Combined data: {len(original_filtered)} original + {len(filled_df)} filled = {len(complete_df)} total weeks")
        
        return complete_df


def collapse_overlapping_predictions(all_preds, z_score=1.96):
    """
    Collapse overlapping predictions from sliding window forecasting with confidence intervals.
    
    Args:
        all_preds: Tensor of shape [num_sequences, horizon, num_targets]
        z_score: Z-score for confidence intervals (default: 1.96 for 95% CI)
    
    Returns:
        tuple: (collapsed_preds, (lower_bound, upper_bound))
            - collapsed_preds: [horizon, num_targets] - Mean predictions
            - lower_bound: [horizon, num_targets] - Lower confidence bound
            - upper_bound: [horizon, num_targets] - Upper confidence bound
    """
    S, H, T = all_preds.shape

    total_timesteps = S + H - 1
    
    # Dictionary to store all predictions for each future timestep
    timestep_preds = {i: [] for i in range(total_timesteps)}
    
    # Collect predictions for each timestep
    for seq_idx in range(S):
        for h in range(H):
            future_timestep = seq_idx + h
            timestep_preds[future_timestep].append(all_preds[seq_idx, h, :])
    
    # Get predictions for the LAST horizon timesteps
    final_preds = []
    final_std = []
    
    for t in range(total_timesteps - H, total_timesteps):
        preds_at_t = torch.stack(timestep_preds[t])
        final_preds.append(preds_at_t.mean(dim=0))
        final_std.append(preds_at_t.std(dim=0, unbiased=False))
    
    collapsed_preds = torch.stack(final_preds)
    prediction_std = torch.stack(final_std)
    
    # Compute confidence intervals
    lower_bound = collapsed_preds - z_score * prediction_std
    upper_bound = collapsed_preds + z_score * prediction_std
    
    return collapsed_preds, (lower_bound, upper_bound)


def test_model(model, y_past_batch, target_scaler, device='cpu'):
    """
    Test model on dataloader and return collapsed predictions with confidence intervals.
    
    Args:
        model: Trained model
        y_past_batch: Tensor [num_samples, seq_len, num_targets] already prepared
        target_scaler: Scaler for inverse transform
        device: Device to run on
    
    Returns:
        tuple: (collapsed_preds, CI)
            - collapsed_preds: [horizon, num_targets] - Mean predictions
            - CI: tuple of (lower_bound, upper_bound) each [horizon, num_targets]
    """

    with torch.no_grad():
        y_past_batch = y_past_batch.to(device) # [B, total_samples, horizon, num_targets]
        outputs = model(y_past_batch)
        preds = outputs.prediction_outputs  # [total_samples, horizon, num_targets]
    # Move to CPU for processing
    preds_3d_scaled = preds.cpu()
    
    # Flatten - 2D format
    preds_flat_scaled = preds_3d_scaled.contiguous().view(-1, preds_3d_scaled.size(-1)) # [total_samples * horizon, num_targets]
    
    # Inverse transform flattened versions
    preds_flat_unscaled = torch.from_numpy(
        target_scaler.inverse_transform(preds_flat_scaled.numpy()) ).float() # [total_samples * horizon, num_targets] 
    
    # Reshape unscaled back to 3D
    preds_3d_unscaled = preds_flat_unscaled.reshape(preds_3d_scaled.shape) # [total_samples, horizon, num_targets]
    
    # Collapse overlapping predictions
    collapsed_preds, CI = collapse_overlapping_predictions(preds_3d_unscaled)
    
    return collapsed_preds, CI


"""
def test_model_simplified(model, y_past_batch, target_scaler, device='cpu'):

    Simplified test function without DataLoader for direct batch processing.
    
    Args:
        model: Trained model
        y_past_batch: Tensor [num_samples, seq_len, num_targets] already prepared
        target_scaler: Scaler for inverse transform
        device: Device to run on
    
    Returns:
        tuple: (collapsed_preds, CI)
    
    # Inverse transform
    preds_flat_unscaled = torch.from_numpy(
        target_scaler.inverse_transform(preds_flat_scaled.numpy())
    ).float()
    
    # Reshape back to 3D
    preds_3d_unscaled = preds_flat_unscaled.reshape(preds_3d_scaled.shape)
    
    # Collapse
    collapsed_preds, CI = collapse_overlapping_predictions(preds_3d_unscaled)
    
    return collapsed_preds, CI

"""

    