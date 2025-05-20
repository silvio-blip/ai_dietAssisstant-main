import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
import joblib
import os

# Create a simple dummy dataset for training
def create_training_data():
    np.random.seed(42)
    n_samples = 100
    
    data = {
        'age': np.random.randint(18, 80, n_samples),
        'weight': np.random.randint(50, 120, n_samples),
        'height': np.random.randint(150, 200, n_samples),
        'is_active': np.random.choice([0, 1], n_samples),
        'is_vegan': np.random.choice([0, 1], n_samples),
        'has_diabetes': np.random.choice([0, 1], n_samples)
    }
    
    # Simple rule-based diet recommendations (0: Low-cal, 1: Balanced, 2: High-protein)
    y = []
    for i in range(n_samples):
        if data['has_diabetes'][i]:
            y.append(0)  # Low-cal diet for diabetics
        elif data['is_vegan'][i]:
            y.append(1)  # Balanced diet for vegans
        else:
            y.append(2)  # High-protein diet for others
    
    return pd.DataFrame(data), np.array(y)

def train_model():
    # Create and prepare data
    X, y = create_training_data()
    
    # Train a simple random forest classifier
    model = RandomForestClassifier(n_estimators=10, random_state=42)
    model.fit(X, y)
    
    # Save the model
    model_path = '../models/diet_recommender.pkl'
    os.makedirs(os.path.dirname(model_path), exist_ok=True)
    joblib.dump(model, model_path)
    print(f"Model saved to {model_path}")

if __name__ == "__main__":
    train_model() 