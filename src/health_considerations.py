def adjust_for_health_conditions(diet_plan, health_conditions):
    if not health_conditions:
        return diet_plan
        
    # Convert health conditions to lowercase for case-insensitive comparison
    health_conditions = [condition.lower() for condition in health_conditions]
    adjusted_plan = []
    
    for food in diet_plan:
        should_include = True
        
        # Adjust for diabetes - allow moderate sugar
        if 'diabetes' in health_conditions and food.get('sugar', 0) > 15:
            should_include = False
            
        # Adjust for high cholesterol - allow moderate fat
        if 'high cholesterol' in health_conditions and food.get('fat', 0) > 25:
            should_include = False
            
        if should_include:
            adjusted_plan.append(food)
    
    # Ensure we have at least 2 meals in the plan
    if len(adjusted_plan) < 2:
        # Add back the healthiest options from removed foods
        removed_foods = [f for f in diet_plan if f not in adjusted_plan]
        removed_foods.sort(key=lambda x: (x.get('sugar', 0), x.get('fat', 0)))
        
        while len(adjusted_plan) < 2 and removed_foods:
            adjusted_plan.append(removed_foods.pop(0))
            
    return adjusted_plan
