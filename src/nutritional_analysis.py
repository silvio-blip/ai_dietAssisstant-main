def analyze_nutrition(diet_plan, food_database):
    nutritional_content = {
        'calories': 0,
        'protein': 0,
        'carbs': 0,
        'fat': 0,
        'sugar': 0
    }
    
    for food in diet_plan:
        for nutrient in nutritional_content:
            nutritional_content[nutrient] += food.get(nutrient, 0)
            
    # Round values to 1 decimal place
    return {k: round(v, 1) for k, v in nutritional_content.items()}
