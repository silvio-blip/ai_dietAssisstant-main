import joblib
import os
import pandas as pd

def load_model(model_path):
    if not os.path.exists(model_path):
        raise FileNotFoundError(f"Model file not found: {model_path}")
    return joblib.load(model_path)

def recommend_diet(user_profile, model):
    """Generate diet recommendations based on user profile using the trained model"""
    try:
        # Convert user profile to model features
        features = {
            'age': user_profile['age'],
            'weight': user_profile['weight'],
            'height': user_profile['height'],
            'is_active': 1 if 'active' in user_profile['activity_level'].lower() else 0,
            'is_vegan': 1 if 'vegan' in [r.lower() for r in user_profile['dietary_restrictions']] else 0,
            'has_diabetes': 1 if 'diabetes' in [c.lower() for c in user_profile['health_conditions']] else 0
        }
        
        # Convert to DataFrame to ensure correct feature order
        X = pd.DataFrame([features])
        
        # Get prediction
        diet_type = model.predict(X)[0]
        
        # Convert prediction to recommendation
        recommendations = {
            0: "Low-calorie diet recommended due to health conditions",
            1: "Balanced plant-based diet recommended",
            2: "High-protein diet recommended for your profile"
        }
        
        return recommendations.get(diet_type, "Balanced diet recommended")
        
    except Exception as e:
        raise ValueError(f"Error generating recommendations: {str(e)}")
