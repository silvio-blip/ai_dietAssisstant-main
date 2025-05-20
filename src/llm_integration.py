import requests
import json
import logging
from typing import Dict, Any, List, Optional

logger = logging.getLogger(__name__)

LLM_API_URL = "http://127.0.0.1:1234/v1/chat/completions"

def get_meal_suggestions(user_profile: Dict[str, Any], meal_nutrients: Dict[str, float], meal_number: int, 
                        mood: str = None, preferred_cuisine: str = None) -> Optional[str]:
    """Get personalized meal suggestions with cultural preferences and mood considerations"""
    try:
        # Add mood-based adjustments
        mood_suggestions = {
            "stressed": "comforting and easily digestible",
            "tired": "energy-boosting with complex carbs",
            "energetic": "protein-rich and light",
            "hungry": "filling and satisfying",
        }
        mood_context = f"The user is feeling {mood} today, so suggest {mood_suggestions.get(mood.lower(), 'balanced')} foods. " if mood else ""
        
        # Add cuisine preference context
        cuisine_context = f"Please suggest meals aligned with {preferred_cuisine} cuisine. " if preferred_cuisine else ""

        prompt = f"""As a nutrition expert, provide a detailed meal suggestion with recipe for Meal {meal_number} based on these requirements:

User Profile:
- Age: {user_profile['age']}
- Gender: {user_profile['gender']}
- Activity Level: {user_profile['activity_level']}
- Dietary Restrictions: {', '.join(user_profile['dietary_restrictions'])}
- Health Conditions: {', '.join(user_profile['health_conditions'])}

{mood_context}
{cuisine_context}

Required Nutrients:
- Calories: {meal_nutrients['calories']} kcal
- Protein: {meal_nutrients['protein']}g
- Carbs: {meal_nutrients['carbs']}g
- Fat: {meal_nutrients['fat']}g
- Sugar: {meal_nutrients['sugar']}g

Please provide:
1. A main dish suggestion with portion sizes
2. Optional side dishes or accompaniments
3. Cooking method and estimated time
4. Key nutritional benefits
5. Any health-specific considerations
6. Cultural cooking tips (if applicable)
7. Mood-boosting benefits
8. Sustainability rating (1-5 stars)

Format your response in a clear, structured way using '**' to separate sections.
Include a difficulty rating (Easy/Medium/Hard) and estimated cost ($-$$$)."""

        payload = {
            "messages": [
                {
                    "role": "system",
                    "content": "You are a professional nutritionist and chef who provides detailed, culturally-aware meal suggestions with consideration for emotional well-being."
                },
                {"role": "user", "content": prompt}
            ],
            "model": "phi-3.1-mini-128k-instruct",
            "temperature": 0.7,
            "max_tokens": 800
        }

        response = requests.post(LLM_API_URL, json=payload, timeout=10)
        response.raise_for_status()
        
        suggestion = response.json()['choices'][0]['message']['content']
        
        if not suggestion or len(suggestion) < 50:
            return generate_fallback_suggestion(meal_nutrients, meal_number, mood, preferred_cuisine)
            
        logger.info(f"Successfully generated detailed meal suggestion for meal {meal_number}")
        return suggestion

    except Exception as e:
        logger.error(f"Error getting meal suggestion: {str(e)}")
        return generate_fallback_suggestion(meal_nutrients, meal_number, mood, preferred_cuisine)

def generate_fallback_suggestion(meal_nutrients: Dict[str, float], meal_number: int, 
                               mood: str = None, preferred_cuisine: str = None) -> str:
    """Generate a basic meal suggestion with cultural and mood considerations"""
    meal_time = {
        1: "breakfast",
        2: "lunch",
        3: "dinner"
    }.get(meal_number, "meal")
    
    # Adjust protein source based on cuisine preference
    cuisine_proteins = {
        "indian": ["paneer", "dal", "chickpeas"],
        "mediterranean": ["grilled fish", "lamb", "chickpeas"],
        "mexican": ["black beans", "chicken", "beef"],
        "asian": ["tofu", "fish", "chicken"],
        "vegetarian": ["tempeh", "seitan", "lentils"],
        "vegan": ["tempeh", "seitan", "lentils"]
    }
    
    # Default protein sources
    default_proteins = ["lean chicken breast", "fish", "eggs"]
    
    # Select protein source based on cuisine or dietary preference
    if preferred_cuisine and preferred_cuisine.lower() in cuisine_proteins:
        protein_options = cuisine_proteins[preferred_cuisine.lower()]
    elif "vegetarian" in (user_profile.get('dietary_restrictions') or []):
        protein_options = cuisine_proteins["vegetarian"]
    elif "vegan" in (user_profile.get('dietary_restrictions') or []):
        protein_options = cuisine_proteins["vegan"]
    else:
        protein_options = default_proteins
    
    protein_source = protein_options[0] if meal_nutrients['protein'] > 20 else protein_options[-1]
    
    # Adjust carb source based on cuisine
    cuisine_carbs = {
        "indian": ["basmati rice", "roti", "quinoa"],
        "mediterranean": ["couscous", "bulgur", "whole grain pasta"],
        "mexican": ["brown rice", "corn tortilla", "quinoa"],
        "asian": ["brown rice", "rice noodles", "quinoa"]
    }
    
    default_carbs = ["brown rice", "quinoa", "sweet potato"]
    carb_options = cuisine_carbs.get(preferred_cuisine.lower(), default_carbs) if preferred_cuisine else default_carbs
    carb_source = carb_options[0] if meal_nutrients['carbs'] > 40 else carb_options[-1]
    
    # Mood-based additions
    mood_additions = {
        "stressed": "and calming chamomile tea",
        "tired": "with an energy-boosting green tea",
        "energetic": "with a refreshing citrus water",
        "hungry": "with extra vegetables for satiety"
    }
    mood_addition = f" {mood_additions.get(mood.lower(), '')}" if mood else ""
    
    suggestion = f"""Main Dish: Balanced {meal_time} plate{mood_addition} **
Ingredients:
- {protein_source} ({round(meal_nutrients['protein'] * 4)}g)
- {carb_source} ({round(meal_nutrients['carbs'] * 4)}g)
- Mixed vegetables (2 cups)
- Healthy fats (1 tbsp olive oil) **
Preparation:
- Cook {protein_source} using minimal oil
- Prepare {carb_source} according to package instructions
- Steam or roast vegetables
- Combine all ingredients **
Nutritional Benefits:
- Complete protein source
- Complex carbohydrates for sustained energy
- Essential vitamins and minerals from vegetables
- Healthy fats for nutrient absorption **
Mood Benefits:
- {get_mood_benefits(mood) if mood else 'Balanced nutrition for overall well-being'}
Difficulty: Easy
Cost: $$
Sustainability Rating: ★★★★☆
Cooking Time: 25-30 minutes"""

    return suggestion

def get_mood_benefits(mood: str) -> str:
    """Get mood-specific benefits for the meal"""
    benefits = {
        "stressed": "Contains magnesium and B-vitamins to help reduce stress and promote relaxation",
        "tired": "Rich in complex carbs and B-vitamins for sustained energy release",
        "energetic": "Balanced protein and carbs to maintain energy levels",
        "hungry": "High in fiber and protein for improved satiety"
    }
    return benefits.get(mood.lower(), "Balanced nutrition for overall well-being")

def get_diet_explanation(user_profile: Dict[str, Any], total_nutrition: Dict[str, float]) -> Optional[str]:
    """Get an overall explanation of the diet plan with enhanced health insights"""
    try:
        prompt = f"""As a nutrition expert, provide a comprehensive explanation of this diet plan's suitability for the user:

User Profile:
- Age: {user_profile['age']}
- Gender: {user_profile['gender']}
- Activity Level: {user_profile['activity_level']}
- Dietary Restrictions: {', '.join(user_profile['dietary_restrictions'])}
- Health Conditions: {', '.join(user_profile['health_conditions'])}

Daily Nutritional Totals:
- Total Calories: {total_nutrition['calories']} kcal
- Total Protein: {total_nutrition['protein']}g
- Total Carbs: {total_nutrition['carbs']}g
- Total Fat: {total_nutrition['fat']}g
- Total Sugar: {total_nutrition['sugar']}g

Please provide:
1. Why this nutritional breakdown is appropriate
2. How it addresses specific health conditions
3. Tips for maintaining this diet
4. Potential benefits to expect
5. Any necessary precautions"""

        payload = {
            "messages": [
                {
                    "role": "system",
                    "content": "You are a professional nutritionist and chef who provides detailed, culturally-aware meal suggestions with consideration for emotional well-being."
                },
                {"role": "user", "content": prompt}
            ],
            "model": "phi-3.1-mini-128k-instruct",
            "temperature": 0.7,
            "max_tokens": 800
        }

        response = requests.post(LLM_API_URL, json=payload, timeout=10)
        response.raise_for_status()
        
        explanation = response.json()['choices'][0]['message']['content']
        if not explanation or len(explanation) < 50:
            return generate_fallback_explanation(user_profile, total_nutrition)
            
        logger.info("Successfully generated detailed diet plan explanation")
        return explanation

    except Exception as e:
        logger.error(f"Error getting diet explanation: {str(e)}")
        return generate_fallback_explanation(user_profile, total_nutrition)

def generate_fallback_explanation(user_profile: Dict[str, Any], total_nutrition: Dict[str, float]) -> str:
    """Generate a basic diet plan explanation based on user profile and nutrition totals"""
    activity_factor = {
        'sedentary': 1.2,
        'light': 1.375,
        'moderate': 1.55,
        'very': 1.725,
        'extra': 1.9
    }.get(user_profile['activity_level'].lower(), 1.2)
    
    base_calories = total_nutrition['calories'] / activity_factor
    
    explanation = f"""This personalized diet plan is designed to support your health goals while considering your specific needs. The daily caloric intake of {round(total_nutrition['calories'])} kcal is calculated based on your age, gender, and {user_profile['activity_level']} activity level.

The macronutrient distribution focuses on:
- Protein ({round(total_nutrition['protein'])}g): Supports muscle maintenance and recovery
- Carbohydrates ({round(total_nutrition['carbs'])}g): Provides sustained energy throughout the day
- Fats ({round(total_nutrition['fat'])}g): Essential for nutrient absorption and hormone production
- Controlled sugar ({round(total_nutrition['sugar'])}g): Helps maintain stable blood sugar levels

This plan takes into account your specific dietary requirements and health conditions, ensuring optimal nutrition while avoiding any contraindicated foods."""

    return explanation 