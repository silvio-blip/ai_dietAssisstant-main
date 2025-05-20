from flask import Flask, request, jsonify
from flask_cors import CORS
import sys
import os
import logging
from datetime import datetime
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Add the src directory to Python path to import our modules
current_dir = os.path.dirname(os.path.abspath(__file__))  # /backend/api
backend_dir = os.path.dirname(current_dir)  # /backend
src_dir = os.path.dirname(backend_dir)  # /src
root_dir = os.path.dirname(src_dir)  # /ai_diet_assistant

# Add src directory to Python path
if src_dir not in sys.path:
    sys.path.insert(0, src_dir)
    logger.info(f"Added to Python path: {src_dir}")

try:
    from user_management import UserProfile
    from diet_generator import generate_diet_plan
    from nutritional_analysis import analyze_nutrition
    from health_considerations import adjust_for_health_conditions
    from recommendation_engine import load_model, recommend_diet
    from llm_integration import get_meal_suggestions, get_diet_explanation
    logger.info("Successfully imported all required modules")
except Exception as e:
    logger.error(f"Error importing modules: {str(e)}")
    raise

app = Flask(__name__)
CORS(app, resources={
    r"/*": {  # Allow all routes
        "origins": ["http://localhost:3000"],  # React development server
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})

# Get API key from environment variable
GOOGLE_PLACES_API_KEY = os.getenv('GOOGLE_PLACES_API_KEY')
if not GOOGLE_PLACES_API_KEY:
    logger.warning("Google Places API key not found in environment variables!")

def load_food_database():
    """Load and process the food database"""
    try:
        import pandas as pd
        file_path = os.path.join(root_dir, 'data', 'food_database.csv')
        logger.info(f"Attempting to load food database from: {file_path}")
        
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"Food database not found at: {file_path}")
            
        df = pd.read_csv(file_path)
        logger.info(f"Successfully loaded food database with {len(df)} entries")
        
        food_database = {}
        for _, row in df.iterrows():
            food_name = row['food_name']
            food_data = row.drop('food_name').to_dict()
            food_database[food_name] = food_data
        
        return food_database
    except Exception as e:
        logger.error(f"Error loading food database: {str(e)}")
        raise

@app.route('/api/test', methods=['GET'])
def test():
    """Test endpoint to verify API is working"""
    return jsonify({"status": "success", "message": "API is working!"})

@app.route('/api/generate-diet', methods=['POST'])
def generate_diet():
    try:
        data = request.json
        logger.info(f"Received request data: {data}")
        
        # Create user profile
        try:
            user = UserProfile(
                user_id=1,  # Default user ID
                age=data['age'],
                gender=data['gender'],
                weight=data['weight'],
                height=data['height'],
                activity_level=data['activity_level'],
                dietary_restrictions=data['dietary_restrictions'],
                health_conditions=data['health_conditions']
            )
            logger.info("Successfully created user profile")
        except Exception as e:
            logger.error(f"Error creating user profile: {str(e)}")
            raise ValueError(f"Invalid user data: {str(e)}")

        # Load food database
        try:
            food_database = load_food_database()
            logger.info("Successfully loaded food database")
        except Exception as e:
            logger.error(f"Error loading food database: {str(e)}")
            raise

        # Generate initial diet plan
        try:
            diet_plan = generate_diet_plan(user, food_database)
            logger.info("Successfully generated initial diet plan")
        except Exception as e:
            logger.error(f"Error generating diet plan: {str(e)}")
            raise
        
        # Adjust for health conditions
        try:
            adjusted_plan = adjust_for_health_conditions(diet_plan, user.health_conditions)
            logger.info("Successfully adjusted diet plan for health conditions")
        except Exception as e:
            logger.error(f"Error adjusting for health conditions: {str(e)}")
            raise
        
        # Calculate nutrition
        try:
            nutrition = analyze_nutrition(adjusted_plan, food_database)
            logger.info("Successfully calculated nutrition information")
        except Exception as e:
            logger.error(f"Error calculating nutrition: {str(e)}")
            raise

        # Get meal suggestions from LM Studio
        try:
            meal_suggestions = []
            for i, meal in enumerate(adjusted_plan, 1):
                suggestion = get_meal_suggestions(vars(user), meal, i)
                meal_suggestions.append(suggestion)
            logger.info("Successfully generated meal suggestions")
        except Exception as e:
            logger.warning(f"Error getting meal suggestions: {str(e)}")
            meal_suggestions = [None] * len(adjusted_plan)

        # Get overall diet explanation
        try:
            diet_explanation = get_diet_explanation(vars(user), nutrition)
            logger.info("Successfully generated diet explanation")
        except Exception as e:
            logger.warning(f"Error getting diet explanation: {str(e)}")
            diet_explanation = None

        # Try to get model recommendation
        recommendation = None
        try:
            model_path = os.path.join(root_dir, 'models', 'diet_recommender.pkl')
            if os.path.exists(model_path):
                model = load_model(model_path)
                recommendation = recommend_diet(vars(user), model)
                logger.info("Successfully generated model recommendation")
        except Exception as e:
            logger.warning(f"Model recommendation error: {str(e)}")
            # Continue without model recommendation

        # Enhance the diet plan with AI suggestions
        enhanced_plan = []
        for meal, suggestion in zip(adjusted_plan, meal_suggestions):
            meal_data = meal.copy()
            meal_data['ai_suggestion'] = suggestion
            enhanced_plan.append(meal_data)

        response = {
            'diet_plan': enhanced_plan,
            'nutrition': nutrition,
            'recommendation': recommendation,
            'explanation': diet_explanation
        }
        
        logger.info("Successfully prepared response")
        return jsonify(response)

    except Exception as e:
        error_msg = str(e)
        logger.error(f"Error generating diet plan: {error_msg}")
        return jsonify({'error': error_msg}), 400

@app.route('/api/restaurants', methods=['GET'])
def get_nearby_restaurants():
    try:
        lat = request.args.get('lat')
        lng = request.args.get('lng')
        dietary_restrictions = request.args.get('dietary_restrictions', '').split(',')
        meal_calories = float(request.args.get('calories', 0)) or None
        meal_protein = float(request.args.get('protein', 0)) or None
        
        if not lat or not lng:
            return jsonify({'error': 'Location parameters required'}), 400

        if not GOOGLE_PLACES_API_KEY:
            return jsonify({'error': 'API key not configured'}), 500

        # Search keywords based on dietary preferences and health focus
        keywords = []
        if 'vegan' in dietary_restrictions:
            keywords.extend(['pure veg', 'healthy', 'vegan'])
        elif 'vegetarian' in dietary_restrictions:
            keywords.extend(['vegetarian', 'healthy food', 'pure veg'])
        else:
            keywords = ['healthy food', 'diet food', 'nutrition']

        # Add cuisine types
        additional_keywords = [
            'healthy restaurant', 'diet friendly',
            'salad', 'protein rich', 'low calorie'
        ]
        keywords.extend(additional_keywords)

        restaurants = []
        url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"

        # Search for each keyword
        for keyword in keywords:
            params = {
                'location': f"{lat},{lng}",
                'rankby': 'distance',
                'type': 'restaurant',
                'keyword': keyword,
                'key': GOOGLE_PLACES_API_KEY
            }
            
            try:
                response = requests.get(url, params=params)
                places = response.json()
                
                if response.status_code != 200:
                    logger.error(f"Google Places API error for keyword {keyword}: {places.get('error_message', 'Unknown error')}")
                    continue

                for place in places.get('results', []):
                    # Skip if we already have this restaurant
                    if any(r['place_id'] == place['place_id'] for r in restaurants):
                        continue
                        
                    # Get place details
                    details_url = "https://maps.googleapis.com/maps/api/place/details/json"
                    details_params = {
                        'place_id': place['place_id'],
                        'fields': 'name,rating,formatted_address,price_level,website,formatted_phone_number,opening_hours,photos',
                        'key': GOOGLE_PLACES_API_KEY
                    }
                    
                    details_response = requests.get(details_url, params=details_params)
                    if details_response.status_code != 200:
                        continue
                        
                    details = details_response.json()
                    result = details.get('result', {})
                    
                    # Calculate distance
                    location = place.get('geometry', {}).get('location', {})
                    distance = ((float(lat) - location.get('lat', 0))**2 + 
                               (float(lng) - location.get('lng', 0))**2)**0.5 * 111
                    
                    if distance <= 10:
                        # Get healthy dishes based on nutritional requirements
                        healthy_dishes = get_healthy_dishes(
                            place['name'],
                            dietary_restrictions,
                            meal_calories,
                            meal_protein
                        )
                        
                        restaurants.append({
                            'name': place['name'],
                            'place_id': place['place_id'],
                            'distance': f"{round(distance, 1)}km",
                            'rating': place.get('rating', 0),
                            'address': result.get('formatted_address', ''),
                            'phone': result.get('formatted_phone_number', ''),
                            'website': result.get('website', ''),
                            'isOpen': result.get('opening_hours', {}).get('open_now', False),
                            'priceLevel': '💰' * (place.get('price_level', 1) or 1),
                            'matchingDishes': healthy_dishes,
                            'nutritionInfo': {
                                'targetCalories': meal_calories,
                                'targetProtein': meal_protein
                            }
                        })
                    
                    if len(restaurants) >= 15:
                        break
                
                if len(restaurants) >= 15:
                    break
                    
            except requests.exceptions.RequestException as e:
                logger.error(f"Request error for keyword {keyword}: {str(e)}")
                continue

        # Sort restaurants by distance
        restaurants.sort(key=lambda x: float(x['distance'].replace('km', '')))
        
        if not restaurants:
            return jsonify({
                'restaurants': [],
                'message': 'No diet-friendly restaurants found within 10km. Try adjusting your preferences.'
            })

        return jsonify({
            'restaurants': restaurants,
            'nutritionTargets': {
                'calories': meal_calories,
                'protein': meal_protein
            }
        })

    except Exception as e:
        logger.error(f"Error finding restaurants: {str(e)}")
        return jsonify({'error': str(e)}), 500

def get_healthy_dishes(restaurant_name, dietary_restrictions, meal_calories=None, meal_protein=None):
    """Get healthy dish suggestions based on restaurant name, dietary restrictions, and nutritional requirements"""
    def filter_by_nutrition(dishes, target_calories, target_protein):
        # Approximate calorie and protein content for different dishes
        dish_nutrition = {
            # South Indian
            'Plain Dosa': {'calories': 120, 'protein': 3},
            'Masala Dosa': {'calories': 250, 'protein': 6},
            'Idli Sambar': {'calories': 150, 'protein': 5},
            'Vegetable Uttapam': {'calories': 200, 'protein': 6},
            'Upma': {'calories': 180, 'protein': 5},
            
            # North Indian
            'Dal Makhani': {'calories': 300, 'protein': 15},
            'Chole': {'calories': 280, 'protein': 12},
            'Paneer Tikka': {'calories': 320, 'protein': 18},
            'Tandoori Roti': {'calories': 120, 'protein': 4},
            'Mixed Veg Curry': {'calories': 200, 'protein': 6},
            
            # High Protein Options
            'Chicken Breast': {'calories': 250, 'protein': 30},
            'Fish Curry': {'calories': 220, 'protein': 25},
            'Egg Curry': {'calories': 200, 'protein': 15},
            'Paneer Bhurji': {'calories': 280, 'protein': 16},
            'Dal Palak': {'calories': 180, 'protein': 10},
            
            # Low Calorie Options
            'Vegetable Clear Soup': {'calories': 80, 'protein': 2},
            'Green Salad': {'calories': 50, 'protein': 2},
            'Grilled Vegetables': {'calories': 100, 'protein': 3},
            'Sprouts': {'calories': 120, 'protein': 8},
            'Raita': {'calories': 80, 'protein': 3}
        }
        
        filtered_dishes = []
        for dish in dishes:
            nutrition = dish_nutrition.get(dish, {'calories': 250, 'protein': 10})  # Default values
            if (not target_calories or abs(nutrition['calories'] - target_calories) <= 100) and \
               (not target_protein or abs(nutrition['protein'] - target_protein) <= 5):
                filtered_dishes.append(dish)
        
        return filtered_dishes or dishes  # Return original dishes if none match

    vegan_dishes = {
        'south_indian': [
            'Plain Dosa', 'Idli Sambar', 'Vegetable Uttapam',
            'Upma', 'Vegetable Clear Soup', 'Sprouts'
        ],
        'north_indian': [
            'Dal Fry', 'Chole', 'Mixed Veg Curry',
            'Tandoori Roti', 'Green Salad', 'Grilled Vegetables'
        ],
        'healthy': [
            'Sprouts Salad', 'Vegetable Clear Soup',
            'Grilled Vegetables', 'Green Salad', 'Mixed Veg Curry'
        ]
    }
    
    vegetarian_dishes = {
        'south_indian': [
            'Masala Dosa', 'Paneer Dosa', 'Idli Sambar',
            'Vegetable Uttapam', 'Upma', 'Raita'
        ],
        'north_indian': [
            'Paneer Tikka', 'Dal Makhani', 'Paneer Bhurji',
            'Mixed Veg Curry', 'Dal Palak', 'Tandoori Roti'
        ],
        'healthy': [
            'Paneer Tikka', 'Dal Palak', 'Sprouts',
            'Green Salad', 'Raita', 'Mixed Veg Curry'
        ]
    }
    
    non_veg_dishes = {
        'south_indian': [
            'Chicken Curry', 'Fish Curry', 'Egg Curry',
            'Chicken Dosa', 'Chicken Clear Soup'
        ],
        'north_indian': [
            'Chicken Breast', 'Fish Tikka', 'Egg Curry',
            'Tandoori Chicken', 'Chicken Clear Soup'
        ],
        'healthy': [
            'Grilled Chicken Breast', 'Grilled Fish',
            'Egg White Omelette', 'Chicken Clear Soup'
        ]
    }
    
    # Determine restaurant type
    restaurant_lower = restaurant_name.lower()
    if any(word in restaurant_lower for word in ['dosa', 'idli', 'south', 'udupi']):
        cuisine = 'south_indian'
    elif any(word in restaurant_lower for word in ['punjabi', 'north', 'dhaba']):
        cuisine = 'north_indian'
    else:
        cuisine = 'healthy'  # Default to healthy options
    
    # Select dishes based on dietary restrictions
    if 'vegan' in dietary_restrictions:
        dishes = vegan_dishes[cuisine]
    elif 'vegetarian' in dietary_restrictions:
        dishes = vegetarian_dishes[cuisine]
    else:
        dishes = non_veg_dishes[cuisine]
    
    # Filter dishes based on nutritional requirements
    return filter_by_nutrition(dishes, meal_calories, meal_protein)

@app.route('/api/stores', methods=['GET'])
def get_nearby_stores():
    try:
        lat = request.args.get('lat')
        lng = request.args.get('lng')
        
        if not lat or not lng:
            return jsonify({'error': 'Location parameters required'}), 400

        if not GOOGLE_PLACES_API_KEY:
            return jsonify({'error': 'API key not configured'}), 500

        # Call Google Places API to find nearby grocery stores
        url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
        params = {
            'location': f"{lat},{lng}",
            'rankby': 'distance',  # Use rankby instead of radius
            'type': 'grocery_or_supermarket',
            'key': GOOGLE_PLACES_API_KEY
        }
        
        try:
            response = requests.get(url, params=params)
            logger.info(f"Stores API response status: {response.status_code}")
            
            if response.status_code != 200:
                error_data = response.json()
                error_message = error_data.get('error_message', 'Unknown error')
                logger.error(f"Google Places API error: {error_message}")
                logger.error(f"Full error response: {error_data}")
                return jsonify({'error': error_message}), 500

            places = response.json()
            stores = []

            for place in places.get('results', []):
                try:
                    # Get place details
                    details_url = "https://maps.googleapis.com/maps/api/place/details/json"
                    details_params = {
                        'place_id': place['place_id'],
                        'fields': 'name,rating,formatted_address,opening_hours,formatted_phone_number,photos',
                        'key': GOOGLE_PLACES_API_KEY
                    }
                    
                    details_response = requests.get(details_url, params=details_params)
                    if details_response.status_code != 200:
                        logger.error(f"Error fetching details for store {place['place_id']}")
                        continue
                        
                    details = details_response.json()
                    result = details.get('result', {})
                    
                    # Calculate actual distance
                    location = place.get('geometry', {}).get('location', {})
                    distance = ((float(lat) - location.get('lat', 0))**2 + 
                               (float(lng) - location.get('lng', 0))**2)**0.5 * 111  # Rough km calculation
                    
                    if distance <= 5:  # Only include stores within 5km
                        stores.append({
                            'name': place['name'],
                            'distance': f"{round(distance, 1)}km",
                            'address': result.get('formatted_address', ''),
                            'phone': result.get('formatted_phone_number', ''),
                            'isOpen': result.get('opening_hours', {}).get('open_now', False),
                            'rating': place.get('rating', 0),
                            'inStockItems': get_store_items(place['name'])
                        })

                    if len(stores) >= 10:  # Limit to top 10 stores
                        break
                        
                except requests.exceptions.RequestException as e:
                    logger.error(f"Error fetching store details: {str(e)}")
                    continue

            # Sort stores by distance
            stores.sort(key=lambda x: float(x['distance'].replace('km', '')))
            
            if not stores:
                logger.warning("No stores found in the search results")
                return jsonify({
                    'stores': [],
                    'message': 'No grocery stores found within 5km of your location.'
                })

            return jsonify({'stores': stores})

        except requests.exceptions.RequestException as e:
            logger.error(f"Request error: {str(e)}")
            return jsonify({'error': 'Failed to connect to Google Places API'}), 500

    except Exception as e:
        logger.error(f"Error finding stores: {str(e)}")
        return jsonify({'error': str(e)}), 500

def get_store_items(store_name):
    """Get relevant store items based on store name and type"""
    basic_items = ['Fresh Produce', 'Whole Grains', 'Lean Proteins']
    
    store_lower = store_name.lower()
    if 'organic' in store_lower or 'health' in store_lower:
        return basic_items + ['Organic Products', 'Superfoods', 'Health Supplements']
    elif 'market' in store_lower or 'fresh' in store_lower:
        return basic_items + ['Fresh Herbs', 'Local Produce', 'Fresh Bakery']
    else:
        return basic_items + ['Dairy Products', 'Pantry Staples', 'Snacks']

if __name__ == '__main__':
    logger.info("Starting Flask server...")
    # Test if we can load the food database at startup
    try:
        load_food_database()
        logger.info("Food database loaded successfully at startup")
    except Exception as e:
        logger.error(f"Failed to load food database at startup: {e}")
    
    app.run(debug=True, port=5000) 