export interface UserProfile {
  id: string;
  username: string;
  email: string;
  displayName: string;
  avatar?: string;
  preferences: {
    theme: 'light' | 'dark';
    notifications: boolean;
    emailUpdates: boolean;
  };
  stats: {
    daysActive: number;
    plansCreated: number;
    streakDays: number;
    achievements: Achievement[];
    totalPoints: number;
    level: number;
  };
  dietHistory: {
    date: string;
    planId: string;
    completedMeals: number;
    caloriesConsumed: number;
    proteinConsumed: number;
    rating: number;
  }[];
  savedPlans: {
    id: string;
    name: string;
    createdAt: string;
    lastUsed: string;
    rating: number;
  }[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  progress: number;
  total: number;
  category: 'nutrition' | 'consistency' | 'social' | 'milestone';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface UserStats {
  weeklyProgress: {
    date: string;
    completionRate: number;
    caloriesAvg: number;
    proteinAvg: number;
  }[];
  monthlyAchievements: number;
  favoriteRecipes: string[];
  consistencyScore: number;
  nextMilestone: {
    title: string;
    description: string;
    progress: number;
    total: number;
  };
} 