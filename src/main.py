from user_management import UserProfile
from diet_generator import generate_diet_plan
from nutritional_analysis import analyze_nutrition
from health_considerations import adjust_for_health_conditions
from recommendation_engine import load_model, recommend_diet
import os
import pandas as pd

def load_food_database(file_path='../data/food_database.csv'):
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"Food database not found: {file_path}")
    df = pd.read_csv(file_path)
    
    # Convert DataFrame to dictionary excluding the food_name from values
    food_database = {}
    for _, row in df.iterrows():
        food_name = row['food_name']
        food_data = row.drop('food_name').to_dict()
        food_database[food_name] = food_data
    
    return food_database

def main():
    try:
        # Load food database
        food_database = load_food_database()

        # Create example user
        user = UserProfile(
            user_id=1,
            age=30,
            gender='Male',
            weight=70,
            height=175,
            activity_level='Moderately Active',
            dietary_restrictions=['Vegan'],
            health_conditions=['Diabetes']
        )
        
        # Save user profile
        profile_path = '../data/user_profiles.csv'
        user.save_profile(profile_path)
        print(f"User profile saved to {profile_path}")

        # Generate diet plan
        try:
            diet_plan = generate_diet_plan(user, food_database)
            print("\nInitial Diet Plan:")
            for i, meal in enumerate(diet_plan, 1):
                print(f"Meal {i}:", meal)
            
            # Adjust for health conditions
            adjusted_plan = adjust_for_health_conditions(diet_plan, user.health_conditions)
            print("\nAdjusted Diet Plan:")
            for i, meal in enumerate(adjusted_plan, 1):
                print(f"Meal {i}:", meal)
            
            # Calculate nutrition
            nutrition = analyze_nutrition(adjusted_plan, food_database)
            print("\nNutritional Content:")
            for nutrient, value in nutrition.items():
                print(f"{nutrient.title()}: {value}")

        except ValueError as e:
            print(f"\nDiet Generation Error: {e}")
            return

        # Try to load and use the recommendation model
        try:
            model_path = '../models/diet_recommender.pkl'
            if os.path.exists(model_path):
                model = load_model(model_path)
                recommended_diet = recommend_diet(vars(user), model)
                print("\nRecommended Diet:", recommended_diet)
            else:
                print("\nNote: No trained model found at", model_path)
                print("Skipping diet recommendations")
        except Exception as e:
            print(f"\nModel Error: {e}")
            print("Continuing without model recommendations")

    except FileNotFoundError as e:
        print(f"\nError: {e}")
        print("Please ensure all required data files exist")
    except ValueError as e:
        print(f"\nValidation Error: {e}")
    except Exception as e:
        print(f"\nUnexpected Error: {str(e)}")
        print("Please check your inputs and try again")

if __name__ == "__main__":
    main()
