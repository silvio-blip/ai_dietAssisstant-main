import React, { useState } from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
  Badge,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
  useTheme,
  Chip,
  Switch,
  Container,
  alpha,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon,
  Settings as SettingsIcon,
  Help as HelpIcon,
  History as HistoryIcon,
  Logout as LogoutIcon,
  FitnessCenter as FitnessCenterIcon,
  Restaurant as RestaurantIcon,
  Timeline as TimelineIcon,
  EmojiEvents as EmojiEventsIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  Dashboard as DashboardIcon,
  ArrowBack,
  TrendingUp as TrendingUpIcon,
  LocalDining as LocalDiningIcon,
  Assessment,
} from '@mui/icons-material';
import { useUser } from '../contexts/UserContext';
import { useNavigate, useLocation } from 'react-router-dom';

interface NavigationProps {
  currentPage: 'form' | 'plan' | 'dashboard' | 'progress' | 'achievements';
  isOpen: boolean;
  onToggle: () => void;
  showBackButton?: boolean;
}

export default function Navigation({ currentPage, isOpen, onToggle, showBackButton }: NavigationProps) {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, toggleTheme, isDarkMode } = useUser();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationAnchor, setNotificationAnchor] = useState<null | HTMLElement>(null);

  const navigationItems = [
    { 
      text: 'Dashboard', 
      icon: <DashboardIcon />, 
      path: '/dashboard',
      active: currentPage === 'dashboard',
      description: 'Overview of your diet progress'
    },
    { 
      text: 'Diet Plan', 
      icon: <LocalDiningIcon />, 
      path: '/plan',
      active: currentPage === 'plan',
      description: 'View your current diet plan'
    },
    { 
      text: 'Progress Tracking', 
      icon: <TrendingUpIcon />, 
      path: '/progress',
      active: currentPage === 'progress',
      description: 'Track your health metrics'
    },
    { 
      text: 'Achievements', 
      icon: <EmojiEventsIcon />, 
      path: '/achievements',
      active: currentPage === 'achievements',
      description: 'Your milestones and rewards'
    },
  ];

  const handleClose = () => {
    setAnchorEl(null);
    setNotificationAnchor(null);
  };

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotifications = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleLogout = () => {
    handleClose();
    logout();
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    onToggle();
  };

  const drawer = (
    <Box 
      sx={{ 
        width: 280, 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: theme.transitions.create(['width', 'margin'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      }}
    >
      <Box
        sx={{
          py: 4,
          px: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
          bgcolor: theme.palette.mode === 'light' 
            ? theme.palette.primary.main 
            : alpha(theme.palette.primary.main, 0.1),
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `radial-gradient(circle at top right, ${alpha(theme.palette.primary.light, 0.1)}, transparent)`,
            zIndex: 0,
          }
        }}
      >
        <Avatar
          src={user?.photoURL || undefined}
          sx={{ 
            width: 84,
            height: 84,
            border: '3px solid',
            borderColor: 'white',
            bgcolor: theme.palette.mode === 'light' ? 'white' : theme.palette.primary.main,
            color: theme.palette.mode === 'light' ? theme.palette.primary.main : 'white',
            fontSize: '2rem',
            fontWeight: 'bold',
            boxShadow: theme.shadows[4],
            zIndex: 1,
          }}
        >
          {user?.displayName?.[0] || <AccountCircleIcon sx={{ fontSize: '2.5rem' }} />}
        </Avatar>
        <Box sx={{ textAlign: 'center', zIndex: 1 }}>
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 600,
              color: theme.palette.mode === 'light' ? 'white' : theme.palette.text.primary,
            }}
          >
            {user?.displayName || 'Guest'}
          </Typography>
          <Chip
            size="small"
            label="Premium Member"
            sx={{
              mt: 1,
              bgcolor: theme.palette.mode === 'light' 
                ? alpha(theme.palette.common.white, 0.2)
                : theme.palette.primary.main,
              color: theme.palette.mode === 'light' ? 'white' : 'white',
              border: '1px solid',
              borderColor: theme.palette.mode === 'light' 
                ? alpha(theme.palette.common.white, 0.3)
                : theme.palette.primary.dark,
              '& .MuiChip-label': { 
                px: 2,
                fontWeight: 500,
              },
            }}
          />
        </Box>
      </Box>

      <List 
        sx={{ 
          px: 2,
          py: 3,
          flex: 1,
        }}
      >
        {navigationItems.map((item) => (
          <ListItem 
            key={item.text} 
            disablePadding 
            sx={{ mb: 1 }}
          >
            <ListItemButton
              onClick={() => handleNavigate(item.path)}
              selected={item.active}
              sx={{
                borderRadius: 2,
                py: 1.5,
                px: 2,
                transition: theme.transitions.create(['background-color', 'box-shadow']),
                '&:hover': {
                  bgcolor: theme.palette.mode === 'light'
                    ? alpha(theme.palette.primary.main, 0.08)
                    : alpha(theme.palette.primary.main, 0.15),
                },
                '&.Mui-selected': {
                  bgcolor: theme.palette.mode === 'light'
                    ? alpha(theme.palette.primary.main, 0.15)
                    : alpha(theme.palette.primary.main, 0.25),
                  '&:hover': {
                    bgcolor: theme.palette.mode === 'light'
                      ? alpha(theme.palette.primary.main, 0.25)
                      : alpha(theme.palette.primary.main, 0.35),
                  },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 40,
                  color: item.active 
                    ? theme.palette.primary.main
                    : theme.palette.text.secondary,
                }}
              >
                {item.icon}
              </ListItemIcon>
              <Box>
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: item.active ? 600 : 400,
                    color: item.active 
                      ? theme.palette.text.primary
                      : theme.palette.text.secondary,
                  }}
                >
                  {item.text}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: theme.palette.text.secondary,
                    display: 'block',
                  }}
                >
                  {item.description}
                </Typography>
              </Box>
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider sx={{ mx: 2, opacity: 0.5 }} />

      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          bgcolor: theme.palette.mode === 'light'
            ? alpha(theme.palette.primary.main, 0.03)
            : alpha(theme.palette.background.paper, 0.5),
        }}
      >
        <Avatar
          src={user?.photoURL || undefined}
          sx={{ 
            width: 40,
            height: 40,
            bgcolor: theme.palette.primary.main,
          }}
        >
          {user?.displayName?.[0]}
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {user?.displayName}
          </Typography>
          <Typography 
            variant="caption" 
            sx={{ 
              color: theme.palette.primary.main,
              fontWeight: 500,
            }}
          >
            Premium Account
          </Typography>
        </Box>
      </Box>
    </Box>
  );

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: isOpen ? `calc(100% - 280px)` : '100%' },
          ml: { sm: isOpen ? '280px' : 0 },
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="toggle drawer"
            edge="start"
            onClick={onToggle}
            sx={{ 
              mr: 2,
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                transform: 'scale(1.1)',
                bgcolor: alpha(theme.palette.common.white, 0.15),
              },
              '&:active': {
                transform: 'scale(0.95)',
              }
            }}
          >
            <MenuIcon />
          </IconButton>
          
          {showBackButton && (
            <IconButton 
              color="inherit" 
              onClick={() => navigate(-1)}
              sx={{ mr: 1 }}
            >
              <ArrowBack />
            </IconButton>
          )}

          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            AI Diet Assistant
          </Typography>

          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 0.5 
            }}
          >
            <Tooltip title="Help Center">
              <IconButton 
                sx={{ 
                  color: theme.palette.text.secondary,
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                  },
                }}
              >
                <HelpIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Notifications">
              <IconButton 
                onClick={handleNotifications}
                sx={{ 
                  color: theme.palette.text.secondary,
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                  },
                }}
              >
                <Badge 
                  badgeContent={3} 
                  color="error"
                  sx={{
                    '& .MuiBadge-badge': {
                      bgcolor: theme.palette.error.main,
                    },
                  }}
                >
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>

            <Box 
              sx={{ 
                height: 24, 
                width: 1, 
                bgcolor: theme.palette.divider,
                mx: 1,
              }} 
            />

            <Tooltip title="Account settings">
              <IconButton
                onClick={handleMenu}
                sx={{
                  p: 0.5,
                  border: 2,
                  borderColor: 'transparent',
                  transition: theme.transitions.create(['border-color', 'transform']),
                  '&:hover': {
                    borderColor: theme.palette.primary.main,
                    transform: 'scale(1.05)',
                  },
                }}
              >
                <Avatar
                  src={user?.photoURL || undefined}
                  sx={{ 
                    width: 32, 
                    height: 32,
                    bgcolor: theme.palette.primary.main,
                    color: 'white',
                  }}
                >
                  {user?.displayName?.[0] || <AccountCircleIcon />}
                </Avatar>
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        open={isOpen}
        onClose={onToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { 
            width: 280,
            boxSizing: 'border-box',
          },
        }}
      >
        {drawer}
      </Drawer>

      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': {
            width: isOpen ? 280 : 0,
            boxSizing: 'border-box',
            overflow: 'hidden',
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          },
        }}
        open={isOpen}
      >
        {drawer}
      </Drawer>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          elevation: 8,
          sx: {
            mt: 1.5,
            minWidth: 250,
            borderRadius: 2,
            overflow: 'visible',
            border: `1px solid ${theme.palette.divider}`,
            '& .MuiMenuItem-root': {
              py: 1.5,
              px: 2.5,
            },
          },
        }}
      >
        <Box sx={{ p: 2, pb: 1.5 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Signed in as
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 500, mt: 0.5 }}>
            {user?.email}
          </Typography>
        </Box>
        <Divider />
        <MenuItem>
          <ListItemIcon>
            <AccountCircleIcon fontSize="small" />
          </ListItemIcon>
          Your Profile
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem onClick={toggleTheme}>
          <ListItemIcon>
            {isDarkMode ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
          </ListItemIcon>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            Dark Mode
            <Switch
              size="small"
              checked={isDarkMode}
              onChange={toggleTheme}
              sx={{ ml: 1 }}
            />
          </Box>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout} sx={{ color: theme.palette.error.main }}>
          <ListItemIcon sx={{ color: 'inherit' }}>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          Sign Out
        </MenuItem>
      </Menu>

      <Menu
        anchorEl={notificationAnchor}
        open={Boolean(notificationAnchor)}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          elevation: 8,
          sx: {
            mt: 1.5,
            width: 360,
            borderRadius: 2,
            overflow: 'visible',
            border: `1px solid ${theme.palette.divider}`,
          },
        }}
      >
        <Box sx={{ p: 2, pb: 1.5 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Notifications
          </Typography>
          <Typography variant="body2" color="text.secondary">
            You have 3 new notifications
          </Typography>
        </Box>
        <Divider />
        <List sx={{ p: 0 }}>
          <ListItem sx={{ px: 2, py: 1.5 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, width: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar sx={{ bgcolor: theme.palette.primary.main, width: 32, height: 32 }}>
                  <EmojiEventsIcon fontSize="small" />
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" color="primary">
                    New Achievement!
                  </Typography>
                  <Typography variant="body2">
                    You've completed your first week of diet planning 🎉
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                    2 minutes ago
                  </Typography>
                </Box>
              </Box>
            </Box>
          </ListItem>
          <Divider />
          <ListItem sx={{ px: 2, py: 1.5 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, width: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar sx={{ bgcolor: theme.palette.success.main, width: 32, height: 32 }}>
                  <TrendingUpIcon fontSize="small" />
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" color="success.main">
                    Goal Reached
                  </Typography>
                  <Typography variant="body2">
                    You've hit your protein intake goal for today 💪
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                    1 hour ago
                  </Typography>
                </Box>
              </Box>
            </Box>
          </ListItem>
          <Divider />
          <ListItem sx={{ px: 2, py: 1.5 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, width: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar sx={{ bgcolor: theme.palette.info.main, width: 32, height: 32 }}>
                  <LocalDiningIcon fontSize="small" />
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" color="info.main">
                    New Recipe
                  </Typography>
                  <Typography variant="body2">
                    Check out this healthy smoothie recipe 🥤
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                    2 hours ago
                  </Typography>
                </Box>
              </Box>
            </Box>
          </ListItem>
        </List>
        <Divider />
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Typography 
            variant="body2" 
            color="primary"
            sx={{ 
              cursor: 'pointer',
              fontWeight: 500,
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
          >
            View All Notifications
          </Typography>
        </Box>
      </Menu>
    </>
  );
} 