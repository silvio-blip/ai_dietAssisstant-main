import pandas as pd
import os

class UserProfile:
    VALID_ACTIVITY_LEVELS = ['Sedentary', 'Lightly Active', 'Moderately Active', 'Very Active']
    VALID_GENDERS = ['Male', 'Female', 'Other']

    def __init__(self, user_id, age, gender, weight, height, activity_level, dietary_restrictions, health_conditions):
        self.validate_inputs(user_id, age, gender, weight, height, activity_level)
        
        self.user_id = user_id
        self.age = age
        self.gender = gender
        self.weight = weight  # in kg
        self.height = height  # in cm
        self.activity_level = activity_level
        self.dietary_restrictions = dietary_restrictions or []
        self.health_conditions = health_conditions or []

    def validate_inputs(self, user_id, age, gender, weight, height, activity_level):
        if not isinstance(user_id, int) or user_id <= 0:
            raise ValueError("user_id must be a positive integer")
        if not isinstance(age, int) or age <= 0 or age > 120:
            raise ValueError("age must be between 1 and 120")
        if gender not in self.VALID_GENDERS:
            raise ValueError(f"gender must be one of {self.VALID_GENDERS}")
        if not isinstance(weight, (int, float)) or weight <= 0 or weight > 300:
            raise ValueError("weight must be between 0 and 300 kg")
        if not isinstance(height, (int, float)) or height <= 0 or height > 300:
            raise ValueError("height must be between 0 and 300 cm")
        if activity_level not in self.VALID_ACTIVITY_LEVELS:
            raise ValueError(f"activity_level must be one of {self.VALID_ACTIVITY_LEVELS}")

    def save_profile(self, file_path):
        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        df = pd.DataFrame([vars(self)])
        df.to_csv(file_path, mode='a', header=not os.path.exists(file_path), index=False)

    @staticmethod
    def load_profiles(file_path):
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"Profile file not found: {file_path}")
        return pd.read_csv(file_path)
