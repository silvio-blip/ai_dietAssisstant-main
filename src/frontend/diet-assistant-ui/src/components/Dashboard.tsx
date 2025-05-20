import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  LinearProgress,
  Divider,
  Button,
  Avatar,
  IconButton,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Fade,
  Zoom,
  Slide,
  Grow,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Restaurant as RestaurantIcon,
  LocalDining as LocalDiningIcon,
  EmojiEvents as EmojiEventsIcon,
  Timer as TimerIcon,
  Whatshot as WhatshotIcon,
  DirectionsRun as DirectionsRunIcon,
  Favorite as FavoriteIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { useUser } from '../contexts/UserContext';
import { useProgress, Achievement } from '../contexts/ProgressContext';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

const MotionPaper = motion(Paper);
const MotionBox = motion(Box);
const MotionListItem = motion(ListItem);

// Define getRarityColor function outside the component
const getRarityColor = (rarity: string) => {
  switch (rarity) {
    case 'legendary':
      return 'error';
    case 'epic':
      return 'secondary';
    case 'rare':
      return 'primary';
    default:
      return 'default';
  }
};

export default function Dashboard() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { user, getUserData } = useUser();
  const { 
    mealProgress, 
    weeklyProgress, 
    achievements,
    updateMealProgress, 
    updateNutritionProgress,
    checkAchievements,
    toggleMealCompletion
  } = useProgress();
  const userData = getUserData();
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Get today's date in ISO format for consistency
  const today = new Date().toISOString().split('T')[0];
  
  // Get today's progress from mealProgress
  const todayProgress = mealProgress.find(p => p.date === today) || {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    water: 0,
    meals: {
      breakfast: false,
      lunch: false,
      dinner: false
    }
  };

  // Define meals with dynamic completion status
  const [todaysMeals, setTodaysMeals] = useState([
    {
      id: 'breakfast',
      time: '8:00 AM',
      name: 'Breakfast',
      calories: 450,
      completed: todayProgress.meals.breakfast,
      items: ['Oatmeal with berries', 'Greek yogurt', 'Almonds'],
      macros: {
        protein: 20,
        carbs: 45,
        fat: 15
      }
    },
    {
      id: 'lunch',
      time: '1:00 PM',
      name: 'Lunch',
      calories: 650,
      completed: todayProgress.meals.lunch,
      items: ['Grilled chicken salad', 'Quinoa', 'Avocado'],
      macros: {
        protein: 40,
        carbs: 50,
        fat: 25
      }
    },
    {
      id: 'dinner',
      time: '7:00 PM',
      name: 'Dinner',
      calories: 550,
      completed: todayProgress.meals.dinner,
      items: ['Salmon', 'Brown rice', 'Steamed vegetables'],
      macros: {
        protein: 35,
        carbs: 45,
        fat: 20
      }
    }
  ]);

  // Handle meal completion toggle
  const handleMealToggle = async (mealId: string, meal: any) => {
    const newCompleted = !meal.completed;
    
    // Update meal completion status
    await toggleMealCompletion(today, mealId as 'breakfast' | 'lunch' | 'dinner', newCompleted);
    
    // Update nutrition progress if meal is completed
    if (newCompleted) {
      await updateNutritionProgress(today, {
        calories: meal.calories,
        protein: meal.macros.protein,
        carbs: meal.macros.carbs,
        fat: meal.macros.fat,
        water: 500 // Default water intake per meal
      });
    }

    // Update local state
    setTodaysMeals(prevMeals => 
      prevMeals.map(m => 
        m.id === mealId ? { ...m, completed: newCompleted } : m
      )
    );

    // Check for new achievements
    checkAchievements();
  };

  // Update current time and meal status
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      
      // Update meals based on current time
      const now = new Date();
      setTodaysMeals(prevMeals => 
        prevMeals.map(meal => {
          const [hours, minutes] = meal.time.split(':');
          const period = meal.time.includes('PM') ? 'PM' : 'AM';
          let mealHour = parseInt(hours);
          if (period === 'PM' && mealHour !== 12) mealHour += 12;
          if (period === 'AM' && mealHour === 12) mealHour = 0;
          
          const mealTime = new Date();
          mealTime.setHours(mealHour, parseInt(minutes), 0);

          // Only auto-complete if time has passed and meal wasn't manually toggled
          if (now > mealTime && !meal.completed && !todayProgress.meals[meal.id as keyof typeof todayProgress.meals]) {
            handleMealToggle(meal.id, meal);
          }
          
          return meal;
        })
      );
    }, 60000); // Check every minute

    return () => clearInterval(timer);
  }, [todayProgress]);

  // Calculate real-time calories left
  const calculateCaloriesLeft = () => {
    const dailyGoal = getUserData()?.calorieGoal || 2000;
    return dailyGoal - (todayProgress?.calories || 0);
  };

  // Calculate real-time progress percentages
  const calculateProgress = (nutrient: 'calories' | 'protein' | 'carbs' | 'fat') => {
    const goals = {
      calories: getUserData()?.calorieGoal || 2000,
      protein: getUserData()?.proteinGoal || 150,
      carbs: getUserData()?.carbsGoal || 250,
      fat: getUserData()?.fatGoal || 70
    };
    
    const currentValue = todayProgress[nutrient];
    const goalValue = goals[nutrient];
    
    if (typeof currentValue !== 'number' || typeof goalValue !== 'number') {
      return 0;
    }
    
    return Math.round((currentValue / goalValue) * 100);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      {/* Welcome Section with Current Time */}
      <MotionBox
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        sx={{ 
          mb: 4, 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2,
          p: 3,
          borderRadius: 2,
          background: theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, rgba(37, 99, 235, 0.1) 0%, rgba(167, 139, 250, 0.1) 100%)'
            : 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
        }}
      >
        <Avatar
          src={user?.photoURL || undefined}
          sx={{ 
            width: 64, 
            height: 64, 
            bgcolor: theme.palette.mode === 'dark' ? 'rgba(96, 165, 250, 0.2)' : 'primary.main',
            color: theme.palette.mode === 'dark' ? '#60A5FA' : 'white',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            transition: 'transform 0.3s ease',
            '&:hover': {
              transform: 'scale(1.05)'
            }
          }}
        >
          {user?.displayName?.[0]}
        </Avatar>
        <Box>
          <Typography 
            variant="h4" 
            gutterBottom 
            sx={{ 
              color: theme.palette.mode === 'dark' ? '#F3F4F6' : 'white',
              fontWeight: 'bold',
              textShadow: theme.palette.mode === 'dark' ? 'none' : '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            Welcome back, {user?.displayName}!
          </Typography>
          <Typography 
            variant="subtitle1" 
            sx={{ 
              color: theme.palette.mode === 'dark' ? '#D1D5DB' : 'rgba(255,255,255,0.9)'
            }}
          >
            {format(currentTime, 'EEEE, MMMM d • h:mm a')}
          </Typography>
        </Box>
      </MotionBox>
      
      <Grid container spacing={3}>
        {/* Today's Overview */}
        <Grid item xs={12} lg={8}>
          <MotionPaper
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            sx={{ 
              p: 3, 
              mb: 3,
              background: theme.palette.mode === 'dark'
                ? 'linear-gradient(135deg, rgba(31,41,55,0.95) 0%, rgba(17,24,39,0.95) 100%)'
                : 'linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)',
              boxShadow: theme.palette.mode === 'dark'
                ? '0 8px 32px rgba(0,0,0,0.4)'
                : '0 8px 32px rgba(0,0,0,0.1)',
              borderRadius: '16px',
              backdropFilter: 'blur(10px)',
              border: theme.palette.mode === 'dark'
                ? '1px solid rgba(255,255,255,0.1)'
                : 'none',
            }}
          >
            <Typography 
              variant="h6" 
              sx={{ 
                mb: 3,
                color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#2D3748',
                fontSize: '1.25rem',
                fontWeight: 600,
              }}
            >
              Today's Overview
            </Typography>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {[
                {
                  icon: <LocalDiningIcon />,
                  value: calculateCaloriesLeft(),
                  label: 'Calories Left',
                  color: '#60A5FA',
                  bgColor: 'rgba(96, 165, 250, 0.15)'
                },
                {
                  icon: <DirectionsRunIcon />,
                  value: `${todaysMeals.filter(meal => meal.completed).length}/${todaysMeals.length}`,
                  label: 'Meals Completed',
                  color: '#34D399',
                  bgColor: 'rgba(52, 211, 153, 0.15)'
                },
                {
                  icon: <WhatshotIcon />,
                  value: `${Math.round((todaysMeals.filter(meal => meal.completed).length / todaysMeals.length) * 100)}%`,
                  label: 'Daily Goal',
                  color: '#FBBF24',
                  bgColor: 'rgba(251, 191, 36, 0.15)'
                },
                {
                  icon: <FavoriteIcon />,
                  value: weeklyProgress.streak || 0,
                  label: 'Day Streak',
                  color: '#F87171',
                  bgColor: 'rgba(248, 113, 113, 0.15)'
                }
              ].map((stat, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Paper
                    sx={{
                      p: 3,
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      background: theme.palette.mode === 'dark' ? stat.bgColor : 'white',
                      border: theme.palette.mode === 'dark' ? `1px solid ${stat.color}40` : 'none',
                      borderRadius: '16px',
                      boxShadow: theme.palette.mode === 'dark'
                        ? '0 4px 20px rgba(0,0,0,0.4)'
                        : '0 4px 20px rgba(0,0,0,0.1)',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: theme.palette.mode === 'dark'
                          ? '0 8px 25px rgba(0,0,0,0.5)'
                          : '0 8px 25px rgba(0,0,0,0.2)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 2,
                        background: theme.palette.mode === 'dark' ? `${stat.color}40` : stat.bgColor,
                        color: stat.color
                      }}
                    >
                      {stat.icon}
                    </Box>
                    <Typography 
                      variant="h4" 
                      sx={{ 
                        mb: 1,
                        color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#2D3748',
                        fontWeight: 600,
                      }}
                    >
                      {stat.value}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: theme.palette.mode === 'dark' ? '#D1D5DB' : '#718096',
                        textAlign: 'center',
                      }}
                    >
                      {stat.label}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </MotionPaper>

          {/* Today's Meals */}
          <MotionPaper
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            sx={{ 
              p: 3,
              background: theme.palette.mode === 'dark'
                ? 'linear-gradient(135deg, rgba(31,41,55,0.95) 0%, rgba(17,24,39,0.95) 100%)'
                : 'linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)',
              boxShadow: theme.palette.mode === 'dark'
                ? '0 8px 32px rgba(0,0,0,0.4)'
                : '0 8px 32px rgba(0,0,0,0.1)',
              borderRadius: '16px',
              backdropFilter: 'blur(10px)',
              border: theme.palette.mode === 'dark'
                ? '1px solid rgba(255,255,255,0.1)'
                : 'none',
            }}
          >
            <Typography 
              variant="h6" 
              sx={{ 
                mb: 3,
                color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#2D3748',
                fontSize: '1.25rem',
                fontWeight: 600,
              }}
            >
              Today's Meals
            </Typography>
            <List>
              {todaysMeals.map((meal, index) => (
                <React.Fragment key={meal.id}>
                  <MotionListItem
                    onClick={() => handleMealToggle(meal.id, meal)}
                    sx={{
                      cursor: 'pointer',
                      borderRadius: '12px',
                      mb: 2,
                      background: theme.palette.mode === 'dark'
                        ? meal.completed 
                          ? 'linear-gradient(135deg, rgba(52, 211, 153, 0.2) 0%, rgba(52, 211, 153, 0.1) 100%)'
                          : 'linear-gradient(135deg, rgba(31,41,55,0.95) 0%, rgba(17,24,39,0.95) 100%)'
                        : meal.completed
                          ? 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)'
                          : 'rgba(255,255,255,0.8)',
                      boxShadow: theme.palette.mode === 'dark'
                        ? '0 4px 20px rgba(0,0,0,0.4)'
                        : '0 4px 12px rgba(0,0,0,0.05)',
                      border: theme.palette.mode === 'dark'
                        ? '1px solid rgba(255,255,255,0.1)'
                        : 'none',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateX(5px)',
                        boxShadow: theme.palette.mode === 'dark'
                          ? '0 8px 25px rgba(0,0,0,0.5)'
                          : '0 6px 16px rgba(0,0,0,0.1)'
                      }
                    }}
                  >
                    <ListItemIcon>
                      <Avatar 
                        sx={{ 
                          bgcolor: theme.palette.mode === 'dark'
                            ? meal.completed 
                              ? 'rgba(52, 211, 153, 0.2)'
                              : 'rgba(255,255,255,0.1)'
                            : meal.completed 
                              ? 'white' 
                              : 'grey.400',
                          color: theme.palette.mode === 'dark'
                            ? meal.completed
                              ? '#34D399'
                              : '#D1D5DB'
                            : meal.completed
                              ? 'success.main'
                              : 'white',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                        }}
                      >
                        {meal.completed ? <CheckCircleIcon /> : <RestaurantIcon />}
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography 
                            variant="subtitle1" 
                            sx={{ 
                              color: theme.palette.mode === 'dark'
                                ? meal.completed
                                  ? '#34D399'
                                  : '#F3F4F6'
                                : meal.completed
                                  ? 'white'
                                  : 'text.primary',
                              fontWeight: 'bold'
                            }}
                          >
                            {meal.name}
                          </Typography>
                          <Chip
                            size="small"
                            label={`${meal.calories} cal`}
                            sx={{ 
                              bgcolor: theme.palette.mode === 'dark'
                                ? meal.completed
                                  ? 'rgba(52, 211, 153, 0.2)'
                                  : 'rgba(255,255,255,0.1)'
                                : meal.completed
                                  ? 'white'
                                  : 'grey.200',
                              color: theme.palette.mode === 'dark'
                                ? meal.completed
                                  ? '#34D399'
                                  : '#D1D5DB'
                                : meal.completed
                                  ? 'success.main'
                                  : 'text.primary',
                              fontWeight: 'bold',
                              border: theme.palette.mode === 'dark'
                                ? `1px solid ${meal.completed ? 'rgba(52, 211, 153, 0.2)' : 'rgba(255,255,255,0.1)'}`
                                : 'none',
                            }}
                          />
                        </Box>
                      }
                      secondary={
                        <>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: theme.palette.mode === 'dark'
                                ? meal.completed
                                  ? 'rgba(52, 211, 153, 0.8)'
                                  : '#D1D5DB'
                                : meal.completed
                                  ? 'rgba(255,255,255,0.8)'
                                  : 'text.secondary'
                            }}
                          >
                            {meal.time}
                          </Typography>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: theme.palette.mode === 'dark'
                                ? meal.completed
                                  ? 'rgba(52, 211, 153, 0.8)'
                                  : '#D1D5DB'
                                : meal.completed
                                  ? 'rgba(255,255,255,0.8)'
                                  : 'text.secondary'
                            }}
                          >
                            {meal.items.join(', ')}
                          </Typography>
                        </>
                      }
                    />
                  </MotionListItem>
                  {index < todaysMeals.length - 1 && (
                    <Divider 
                      sx={{ 
                        my: 2,
                        borderColor: theme.palette.mode === 'dark'
                          ? 'rgba(255,255,255,0.1)'
                          : 'rgba(0,0,0,0.1)'
                      }} 
                    />
                  )}
                </React.Fragment>
              ))}
            </List>
          </MotionPaper>
        </Grid>
        
        {/* Weekly Progress */}
        <Grid item xs={12} lg={4}>
          <MotionPaper
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            sx={{ 
              p: 3, 
              mb: 3,
              background: theme.palette.mode === 'dark'
                ? 'linear-gradient(135deg, rgba(31,41,55,0.95) 0%, rgba(17,24,39,0.95) 100%)'
                : 'linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)',
              boxShadow: theme.palette.mode === 'dark'
                ? '0 8px 32px rgba(0,0,0,0.4)'
                : '0 8px 32px rgba(0,0,0,0.1)',
              borderRadius: '16px',
              backdropFilter: 'blur(10px)',
              border: theme.palette.mode === 'dark'
                ? '1px solid rgba(255,255,255,0.1)'
                : 'none',
            }}
          >
            <Typography 
              variant="h6" 
              sx={{ 
                mb: 3,
                color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#2D3748',
                fontSize: '1.25rem',
                fontWeight: 600,
              }}
            >
              Weekly Progress
            </Typography>
            {[
              { label: 'Calories', value: calculateProgress('calories'), color: '#60A5FA' },
              { label: 'Protein', value: calculateProgress('protein'), color: '#34D399' },
              { label: 'Carbs', value: calculateProgress('carbs'), color: '#FBBF24' },
              { label: 'Fat', value: calculateProgress('fat'), color: '#F87171' }
            ].map((item, index) => (
              <MotionBox
                key={item.label}
                variants={itemVariants}
                sx={{ mb: 3 }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: theme.palette.mode === 'dark' ? '#D1D5DB' : '#718096',
                      fontWeight: 500
                    }}
                  >
                    {item.label}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: theme.palette.mode === 'dark' ? '#D1D5DB' : '#718096',
                      fontWeight: 500
                    }}
                  >
                    {item.value}%
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={item.value} 
                  sx={{ 
                    height: 8, 
                    borderRadius: 4,
                    bgcolor: theme.palette.mode === 'dark' 
                      ? `${item.color}20`
                      : `${item.color}40`,
                    '& .MuiLinearProgress-bar': {
                      bgcolor: item.color,
                      transition: 'width 1s ease-in-out'
                    }
                  }}
                />
              </MotionBox>
            ))}
          </MotionPaper>

          {/* Recent Achievements */}
          <MotionPaper
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            sx={{ 
              p: 3,
              background: theme.palette.mode === 'dark'
                ? 'linear-gradient(135deg, rgba(31,41,55,0.95) 0%, rgba(17,24,39,0.95) 100%)'
                : 'linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)',
              boxShadow: theme.palette.mode === 'dark'
                ? '0 8px 32px rgba(0,0,0,0.4)'
                : '0 8px 32px rgba(0,0,0,0.1)',
              borderRadius: '16px',
              backdropFilter: 'blur(10px)',
              border: theme.palette.mode === 'dark'
                ? '1px solid rgba(255,255,255,0.1)'
                : 'none',
            }}
          >
            <Typography 
              variant="h6" 
              sx={{ 
                mb: 3,
                color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#2D3748',
                fontSize: '1.25rem',
                fontWeight: 600,
              }}
            >
              Recent Achievements
            </Typography>
            <List>
              {achievements
                .filter((a: Achievement) => a.unlocked)
                .sort((a: Achievement, b: Achievement) => 
                  new Date(b.unlockedAt!).getTime() - new Date(a.unlockedAt!).getTime()
                )
                .slice(0, 3)
                .map((achievement: Achievement, index: number) => (
                  <MotionListItem
                    key={achievement.id}
                    variants={itemVariants}
                    sx={{
                      borderRadius: '12px',
                      mb: 2,
                      background: theme.palette.mode === 'dark'
                        ? 'rgba(255,255,255,0.05)'
                        : 'rgba(255,255,255,0.8)',
                      boxShadow: theme.palette.mode === 'dark'
                        ? '0 4px 20px rgba(0,0,0,0.4)'
                        : '0 4px 12px rgba(0,0,0,0.05)',
                      border: theme.palette.mode === 'dark'
                        ? '1px solid rgba(255,255,255,0.1)'
                        : 'none',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateX(5px)',
                        boxShadow: theme.palette.mode === 'dark'
                          ? '0 8px 25px rgba(0,0,0,0.5)'
                          : '0 6px 16px rgba(0,0,0,0.1)'
                      }
                    }}
                  >
                    <ListItemIcon>
                      <Avatar 
                        sx={{ 
                          bgcolor: theme.palette.mode === 'dark'
                            ? 'rgba(96, 165, 250, 0.2)'
                            : 'primary.light',
                          color: theme.palette.mode === 'dark'
                            ? '#60A5FA'
                            : 'primary.main',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                        }}
                      >
                        <EmojiEventsIcon />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography 
                            variant="subtitle1" 
                            sx={{ 
                              color: theme.palette.mode === 'dark' ? '#F3F4F6' : '#2D3748',
                              fontWeight: 'bold'
                            }}
                          >
                            {achievement.title}
                          </Typography>
                          <Chip
                            size="small"
                            label={achievement.rarity}
                            sx={{ 
                              bgcolor: theme.palette.mode === 'dark'
                                ? 'rgba(96, 165, 250, 0.2)'
                                : 'primary.light',
                              color: theme.palette.mode === 'dark'
                                ? '#60A5FA'
                                : 'primary.main',
                              textTransform: 'capitalize',
                              fontWeight: 'bold',
                              border: theme.palette.mode === 'dark'
                                ? '1px solid rgba(96, 165, 250, 0.2)'
                                : 'none',
                            }}
                          />
                        </Box>
                      }
                      secondary={
                        <>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: theme.palette.mode === 'dark' ? '#D1D5DB' : '#718096'
                            }}
                          >
                            {achievement.description}
                          </Typography>
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              color: theme.palette.mode === 'dark' ? '#34D399' : 'success.main',
                              display: 'block',
                              mt: 1,
                              fontWeight: 'bold'
                            }}
                          >
                            Unlocked {format(new Date(achievement.unlockedAt!), 'MMM d, yyyy')}
                          </Typography>
                        </>
                      }
                    />
                  </MotionListItem>
                ))}
            </List>
          </MotionPaper>
        </Grid>
      </Grid>
    </Box>
  );
} 