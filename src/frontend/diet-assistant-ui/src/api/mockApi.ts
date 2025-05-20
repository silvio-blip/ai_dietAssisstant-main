import { UserData } from '../contexts/UserContext';

export interface DietPlan {
  meals: Array<{
    name: string;
    time: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    ingredients: string[];
  }>;
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  shoppingList: string[];
  recommendation?: string;
  explanation?: string;
}

export const generateDietPlan = (userData: UserData): DietPlan => {
  // Calculate BMR using Harris-Benedict equation
  const bmr = calculateBMR(userData);
  
  // Adjust calories based on activity level
  const activityMultipliers = {
    'sedentary': 1.2,
    'light': 1.375,
    'moderate': 1.55,
    'active': 1.725,
    'very_active': 1.9
  };
  
  const dailyCalories = Math.round(bmr * (activityMultipliers[userData.activity_level as keyof typeof activityMultipliers] || 1.2));
  
  // Calculate macronutrient distribution
  const protein = Math.round((dailyCalories * 0.3) / 4); // 30% of calories from protein
  const fat = Math.round((dailyCalories * 0.25) / 9); // 25% of calories from fat
  const carbs = Math.round((dailyCalories * 0.45) / 4); // 45% of calories from carbs

  // Generate three meals
  const meals = [
    {
      name: "Breakfast",
      time: "8:00 AM",
      calories: Math.round(dailyCalories * 0.3),
      protein: Math.round(protein * 0.3),
      carbs: Math.round(carbs * 0.3),
      fat: Math.round(fat * 0.3),
      ingredients: ["Oatmeal", "Berries", "Nuts", "Protein powder", "Milk"]
    },
    {
      name: "Lunch",
      time: "1:00 PM",
      calories: Math.round(dailyCalories * 0.4),
      protein: Math.round(protein * 0.4),
      carbs: Math.round(carbs * 0.4),
      fat: Math.round(fat * 0.4),
      ingredients: ["Grilled chicken", "Quinoa", "Mixed vegetables", "Olive oil", "Herbs"]
    },
    {
      name: "Dinner",
      time: "7:00 PM",
      calories: Math.round(dailyCalories * 0.3),
      protein: Math.round(protein * 0.3),
      carbs: Math.round(carbs * 0.3),
      fat: Math.round(fat * 0.3),
      ingredients: ["Salmon", "Brown rice", "Asparagus", "Lemon", "Herbs"]
    }
  ];

  // Generate shopping list based on ingredients
  const shoppingList = Array.from(new Set(meals.flatMap(meal => meal.ingredients)));

  // Return the diet plan with the correct structure
  return {
    meals,
    nutrition: {
      calories: dailyCalories,
      protein,
      carbs,
      fat
    },
    shoppingList,
    recommendation: generateRecommendation(userData),
    explanation: generateExplanation(userData, dailyCalories)
  };
};

const calculateBMR = (userData: UserData): number => {
  const { age, gender, weight, height } = userData;
  
  if (gender.toLowerCase() === 'male') {
    return 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
  } else {
    return 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
  }
};

const generateMealSuggestion = (mealType: string, userData: UserData): string => {
  const suggestions = {
    breakfast: [
      "Oatmeal with berries and nuts, plus a protein shake",
      "Greek yogurt parfait with granola and honey",
      "Whole grain toast with avocado and eggs"
    ],
    lunch: [
      "Grilled chicken salad with quinoa",
      "Turkey and avocado wrap with vegetables",
      "Salmon with brown rice and steamed vegetables"
    ],
    dinner: [
      "Lean beef stir-fry with vegetables",
      "Baked fish with sweet potato and asparagus",
      "Tofu and vegetable curry with brown rice"
    ]
  };

  const mealSuggestions = suggestions[mealType as keyof typeof suggestions] || [];
  return mealSuggestions[Math.floor(Math.random() * mealSuggestions.length)] || "Custom meal based on your preferences";
};

const generateRecommendation = (userData: UserData): string => {
  const recommendations = [
    "Based on your activity level and goals, focus on protein-rich foods to support muscle maintenance.",
    "Consider spreading your meals throughout the day to maintain stable energy levels.",
    "Stay hydrated by drinking water between meals and before exercising."
  ];

  return recommendations[Math.floor(Math.random() * recommendations.length)];
};

const generateExplanation = (userData: UserData, calories: number): string => {
  return `This personalized diet plan is designed for your ${userData.activity_level} activity level and takes into account your dietary preferences. The total daily calorie target of ${calories} calories is distributed across three meals to help you maintain a balanced and sustainable diet. Each meal is designed to provide a mix of proteins, carbs, and healthy fats while respecting your dietary restrictions.`;
}; 