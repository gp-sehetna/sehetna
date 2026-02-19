import numpy as np
import torch


def collapse_overlapping_predictions(all_preds, all_targets):
    """
    Collapse overlapping predictions from sliding window forecasting.

    This function is used when you have multiple overlapping prediction windows
    from a sliding window approach. It averages the overlapping predictions and
    computes uncertainty estimates (standard deviation).

    Args:
        all_preds: Tensor of shape [num_sequences, horizon_len, num_targets]
                   All predictions from sliding windows
        all_targets: Tensor of shape [num_sequences, horizon_len, num_targets]
                     All target values (for validation)

    Returns:
        tuple: (collapsed_preds, collapsed_targets, prediction_std)
            - collapsed_preds: shape [horizon_len, num_targets] - Mean predictions
            - collapsed_targets: shape [horizon_len, num_targets] - Mean targets
            - prediction_std: shape [horizon_len, num_targets] - Uncertainty estimate

    Example:
        >>> preds = torch.randn(100, 6, 5)  # 100 windows, horizon=6, 5 targets
        >>> targets = torch.randn(100, 6, 5)
        >>> collapsed_p, collapsed_t, std = collapse_overlapping_predictions(preds, targets)
        >>> collapsed_p.shape
        torch.Size([6, 5])
    """
    num_sequences, horizon_len, num_targets = all_preds.shape

    # Create a structure to hold all predictions for each timestep
    # Total timesteps = num_sequences + horizon_len - 1
    total_timesteps = num_sequences + horizon_len - 1

    # Dictionary to store all predictions for each future timestep
    timestep_preds = {i: [] for i in range(total_timesteps)}
    timestep_targets = {i: [] for i in range(total_timesteps)}

    # Collect predictions for each timestep
    for seq_idx in range(num_sequences):
        for h in range(horizon_len):
            future_timestep = seq_idx + h
            timestep_preds[future_timestep].append(all_preds[seq_idx, h, :])
            timestep_targets[future_timestep].append(all_targets[seq_idx, h, :])

    # Get predictions for the LAST horizon_len timesteps (what you want)
    final_preds = []
    final_targets = []
    final_std = []

    for t in range(total_timesteps - horizon_len, total_timesteps):
        preds_at_t = torch.stack(timestep_preds[t])
        targets_at_t = torch.stack(timestep_targets[t])

        final_preds.append(preds_at_t.mean(dim=0))
        final_targets.append(targets_at_t.mean(dim=0))

        # Standard deviation across overlapping predictions (uncertainty!)
        final_std.append(preds_at_t.std(dim=0))

    collapsed_preds = torch.stack(final_preds)
    collapsed_targets = torch.stack(final_targets)
    prediction_std = torch.stack(final_std)

    return collapsed_preds, collapsed_targets, prediction_std


def compute_confidence_intervals(predictions: np.ndarray, std: np.ndarray, z_score: float = 1.96):
    """
    Compute confidence intervals for predictions.

    Args:
        predictions: Array of shape [horizon, num_targets] with mean predictions
        std: Array of shape [horizon, num_targets] with standard deviations
        z_score: Z-score for confidence level (default: 1.96 for 95% CI)

    Returns:
        tuple: (lower_bound, upper_bound)
            - lower_bound: Array of shape [horizon, num_targets]
            - upper_bound: Array of shape [horizon, num_targets]

    Example:a
        >>> preds = np.array([[10.0, 20.0], [11.0, 21.0]])
        >>> std = np.array([[1.0, 2.0], [1.5, 2.5]])
        >>> lower, upper = compute_confidence_intervals(preds, std)
    """
    lower_bound = predictions - z_score * std
    upper_bound = predictions + z_score * std
    return lower_bound, upper_bound
