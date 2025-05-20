import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Chip,
  Divider,
  Collapse,
  IconButton,
  useTheme,
  useMediaQuery,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import {
  EmojiEvents as EmojiEventsIcon,
  Whatshot as WhatshotIcon,
  WaterDrop as WaterDropIcon,
  LocalDining as LocalDiningIcon,
  DirectionsRun as DirectionsRunIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useProgress } from '../contexts/ProgressContext';

const MotionPaper = motion(Paper);
const MotionBox = motion(Box);
const MotionListItem = motion(ListItem);

export default function Achievements() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { achievements } = useProgress();
  const [expandedAchievement, setExpandedAchievement] = useState<string | null>(null);
  const [recentlyUnlocked, setRecentlyUnlocked] = useState<string[]>([]);

  // Track newly unlocked achievements
  useEffect(() => {
    const newlyUnlocked = achievements
      .filter(a => a.unlocked && a.unlockedAt && 
        new Date(a.unlockedAt).getTime() > Date.now() - 5000) // Unlocked in last 5 seconds
      .map(a => a.id);
    
    if (newlyUnlocked.length > 0) {
      setRecentlyUnlocked(prev => [...new Set([...prev, ...newlyUnlocked])]);
      // Remove from recently unlocked after animation
      setTimeout(() => {
        setRecentlyUnlocked(prev => prev.filter(id => !newlyUnlocked.includes(id)));
      }, 5000);
    }
  }, [achievements]);

  const getAchievementIcon = (iconName: string) => {
    switch (iconName) {
      case 'EmojiEvents':
        return <EmojiEventsIcon />;
      case 'Whatshot':
        return <WhatshotIcon />;
      case 'WaterDrop':
        return <WaterDropIcon />;
      case 'LocalDining':
        return <LocalDiningIcon />;
      case 'DirectionsRun':
        return <DirectionsRunIcon />;
      default:
        return <EmojiEventsIcon />;
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary':
        return theme.palette.mode === 'dark' ? '#FF6B6B' : '#FF4B4B';
      case 'epic':
        return theme.palette.mode === 'dark' ? '#A78BFA' : '#8B5CF6';
      case 'rare':
        return theme.palette.mode === 'dark' ? '#60A5FA' : '#3B82F6';
      default:
        return theme.palette.mode === 'dark' ? '#9CA3AF' : '#6B7280';
    }
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

  const unlockAnimation = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: 1,
      transition: {
        duration: 0.5,
        type: 'spring',
        stiffness: 200
      }
    },
    exit: { 
      scale: 1.2, 
      opacity: 0,
      transition: { duration: 0.3 }
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <MotionBox
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        sx={{ mb: 4 }}
      >
        <Typography 
          variant="h4" 
          gutterBottom 
          sx={{ 
            background: theme.palette.mode === 'dark'
              ? 'linear-gradient(45deg, #60A5FA 30%, #A78BFA 90%)'
              : 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 'bold'
          }}
        >
          Achievements
        </Typography>
      </MotionBox>

      <Grid container spacing={3}>
        {/* Achievement Categories */}
        <Grid item xs={12}>
          <MotionPaper
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            sx={{
              p: 3,
              background: theme.palette.mode === 'dark'
                ? 'linear-gradient(135deg, rgba(31,41,55,0.95) 0%, rgba(17,24,39,0.95) 100%)'
                : 'white',
              borderRadius: 2,
              boxShadow: theme.palette.mode === 'dark'
                ? '0 8px 32px rgba(0,0,0,0.4)'
                : '0 8px 32px rgba(0,0,0,0.1)',
              border: theme.palette.mode === 'dark'
                ? '1px solid rgba(255,255,255,0.1)'
                : 'none'
            }}
          >
            <List>
              {achievements.map((achievement) => (
                <AnimatePresence key={achievement.id}>
                  <MotionListItem
                    variants={itemVariants}
                    {...(recentlyUnlocked.includes(achievement.id) ? unlockAnimation : {})}
                    sx={{
                      mb: 2,
                      borderRadius: 2,
                      background: theme.palette.mode === 'dark'
                        ? achievement.unlocked
                          ? `linear-gradient(135deg, ${getRarityColor(achievement.rarity)}20 0%, ${getRarityColor(achievement.rarity)}10 100%)`
                          : 'rgba(255,255,255,0.05)'
                        : achievement.unlocked
                          ? `linear-gradient(135deg, ${getRarityColor(achievement.rarity)}10 0%, ${getRarityColor(achievement.rarity)}05 100%)`
                          : 'rgba(0,0,0,0.02)',
                      boxShadow: theme.palette.mode === 'dark'
                        ? '0 4px 20px rgba(0,0,0,0.4)'
                        : '0 4px 12px rgba(0,0,0,0.05)',
                      border: theme.palette.mode === 'dark'
                        ? `1px solid ${getRarityColor(achievement.rarity)}40`
                        : `1px solid ${getRarityColor(achievement.rarity)}20`,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateX(8px)',
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
                            ? `${getRarityColor(achievement.rarity)}20`
                            : `${getRarityColor(achievement.rarity)}40`,
                          color: getRarityColor(achievement.rarity)
                        }}
                      >
                        {getAchievementIcon(achievement.icon)}
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                            {achievement.title}
                          </Typography>
                          <Chip
                            size="small"
                            label={achievement.rarity}
                            sx={{
                              bgcolor: theme.palette.mode === 'dark'
                                ? `${getRarityColor(achievement.rarity)}20`
                                : `${getRarityColor(achievement.rarity)}40`,
                              color: getRarityColor(achievement.rarity),
                              textTransform: 'capitalize',
                              fontWeight: 'bold'
                            }}
                          />
                          {achievement.unlocked && (
                            <Tooltip title={`Unlocked on ${new Date(achievement.unlockedAt!).toLocaleDateString()}`}>
                              <IconButton size="small">
                                <InfoIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Box>
                      }
                      secondary={
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            {achievement.description}
                          </Typography>
                          <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{ flex: 1 }}>
                              <LinearProgress
                                variant="determinate"
                                value={(achievement.progress / achievement.total) * 100}
                                sx={{
                                  height: 8,
                                  borderRadius: 4,
                                  bgcolor: theme.palette.mode === 'dark'
                                    ? `${getRarityColor(achievement.rarity)}20`
                                    : `${getRarityColor(achievement.rarity)}40`,
                                  '& .MuiLinearProgress-bar': {
                                    bgcolor: getRarityColor(achievement.rarity)
                                  }
                                }}
                              />
                            </Box>
                            <Typography variant="caption" color="text.secondary">
                              {achievement.progress}/{achievement.total}
                            </Typography>
                          </Box>
                        </Box>
                      }
                    />
                    <IconButton
                      onClick={() => setExpandedAchievement(
                        expandedAchievement === achievement.id ? null : achievement.id
                      )}
                    >
                      {expandedAchievement === achievement.id ? (
                        <ExpandLessIcon />
                      ) : (
                        <ExpandMoreIcon />
                      )}
                    </IconButton>
                  </MotionListItem>
                  <Collapse in={expandedAchievement === achievement.id}>
                    <Box sx={{ pl: 9, pr: 3, pb: 2 }}>
                      <Typography variant="subtitle2" gutterBottom sx={{ color: 'text.secondary' }}>
                        Achievement Details:
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h4" sx={{ color: getRarityColor(achievement.rarity) }}>
                              {achievement.points}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Points
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={6}>
                          <Box sx={{ textAlign: 'center' }}>
                            <CircularProgress
                              variant="determinate"
                              value={(achievement.progress / achievement.total) * 100}
                              sx={{
                                color: getRarityColor(achievement.rarity),
                                '& .MuiCircularProgress-circle': {
                                  strokeLinecap: 'round',
                                }
                              }}
                              size={40}
                            />
                            <Typography variant="caption" color="text.secondary" display="block">
                              Progress
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                  </Collapse>
                </AnimatePresence>
              ))}
            </List>
          </MotionPaper>
        </Grid>
      </Grid>
    </Box>
  );
} 