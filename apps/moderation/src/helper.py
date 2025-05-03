import numpy as np


def convert_float32_to_float(data):
    """Recursively converts numpy float32 to native Python float."""
    if isinstance(data, np.float32):
        return float(data)  # Convert to native Python float
    elif isinstance(data, dict):
        return {key: convert_float32_to_float(value) for key, value in data.items()}
    elif isinstance(data, list):
        return [convert_float32_to_float(item) for item in data]
    return data  # Return the data if no conversion is needed