import random

def is_food_compatible(food_name, dietary_restrictions):
    restrictions = [r.lower() for r in dietary_restrictions]
    
    # Define food categories
    vegan_foods = {'apple', 'banana', 'quinoa', 'brown rice', 'sweet potato', 'spinach', 
                  'lentils', 'almonds', 'black beans', 'avocado', 'tofu', 'oatmeal'}
    vegetarian_foods = vegan_foods | {'greek yogurt'}
    gluten_free_foods = {'apple', 'banana', 'chicken breast', 'salmon', 'sweet potato', 
                        'spinach', 'lentils', 'almonds', 'greek yogurt', 'quinoa', 
                        'black beans', 'avocado', 'tofu'}
    lactose_free_foods = {'apple', 'banana', 'chicken breast', 'salmon', 'brown rice', 
                         'sweet potato', 'spinach', 'lentils', 'almonds', 'quinoa', 
                         'black beans', 'avocado', 'tofu', 'oatmeal'}
    
    food_name = food_name.lower()
    
    if 'vegan' in restrictions and food_name not in vegan_foods:
        return False
    if 'vegetarian' in restrictions and food_name not in vegetarian_foods:
        return False
    if 'gluten-free' in restrictions and food_name not in gluten_free_foods:
        return False
    if 'lactose-free' in restrictions and food_name not in lactose_free_foods:
        return False
    
    return True

def generate_diet_plan(user_profile, food_database):
    # Filter foods based on dietary restrictions
    available_foods = [
        food_name for food_name in food_database.keys()
        if is_food_compatible(food_name, user_profile.dietary_restrictions)
    ]
    
    if not available_foods:
        raise ValueError("No compatible foods found for the given dietary restrictions")
    
    # Generate diet plan with 3 meals
    diet_plan = []
    for _ in range(3):  # 3 meals a day
        food_name = random.choice(available_foods)
        diet_plan.append(food_database[food_name])
    
    return diet_plan
