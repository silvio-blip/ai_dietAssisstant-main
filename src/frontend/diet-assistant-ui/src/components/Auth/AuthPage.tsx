import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Divider,
  IconButton,
  InputAdornment,
  Alert,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Container,
  Grid,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import {
  Visibility,
  VisibilityOff,
  Google as GoogleIcon,
  Facebook as FacebookIcon,
  Apple as AppleIcon,
  FitnessCenter,
  Restaurant,
  MonitorWeight,
  EmojiEvents,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useUser } from '../../contexts/UserContext';

const socialButtons = [
  { icon: <GoogleIcon />, label: 'Continue with Google', color: '#DB4437' },
  { icon: <FacebookIcon />, label: 'Continue with Facebook', color: '#4267B2' },
  { icon: <AppleIcon />, label: 'Continue with Apple', color: '#000000' },
];

const features = [
  {
    icon: <FitnessCenter sx={{ fontSize: 40 }} />,
    title: 'Personalized Workouts',
    description: 'Get customized workout plans that match your fitness level'
  },
  {
    icon: <Restaurant sx={{ fontSize: 40 }} />,
    title: 'Meal Planning',
    description: 'Access healthy recipes and meal plans tailored to your goals'
  },
  {
    icon: <MonitorWeight sx={{ fontSize: 40 }} />,
    title: 'Progress Tracking',
    description: 'Track your weight, measurements, and nutrition goals'
  },
  {
    icon: <EmojiEvents sx={{ fontSize: 40 }} />,
    title: 'Achievements',
    description: 'Earn rewards and celebrate your fitness milestones'
  },
];

export default function AuthPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const { login, register, isLoading } = useUser();
  const [formError, setFormError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    displayName: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await register(formData.email, formData.password, formData.displayName);
      }
    } catch (error) {
      setFormError('Authentication failed. Please check your credentials.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        position: 'relative',
        background: theme.palette.mode === 'dark'
          ? `linear-gradient(45deg, ${alpha(theme.palette.primary.dark, 0.8)} 0%, ${alpha(theme.palette.secondary.dark, 0.8)} 100%)`
          : `linear-gradient(45deg, ${alpha('#f3f4f6', 0.9)} 0%, ${alpha('#ffffff', 0.9)} 100%)`,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'url("https://images.unsplash.com/photo-1490645935967-10de6ba17061")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.1,
          zIndex: 0,
        },
      }}
    >
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 }, position: 'relative', zIndex: 1 }}>
        <Grid container spacing={4} alignItems="center">
          {/* Left side - Features */}
          <Grid item xs={12} md={6} 
            component={motion.div}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Box sx={{ pr: { md: 6 }, mb: { xs: 4, md: 0 } }}>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 800,
                  mb: 3,
                  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Transform Your Life with Smart Diet Planning
              </Typography>
              <Typography
                variant="h6"
                color="text.secondary"
                sx={{ mb: 4, fontWeight: 500 }}
              >
                Join thousands achieving their health goals with personalized nutrition guidance
              </Typography>

              <Grid container spacing={3}>
                {features.map((feature, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Box
                      component={motion.div}
                      whileHover={{ scale: 1.02 }}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        bgcolor: alpha(theme.palette.background.paper, 0.8),
                        backdropFilter: 'blur(8px)',
                        boxShadow: theme.shadows[2],
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                      }}
                    >
                      <Box
                        sx={{
                          mb: 2,
                          color: theme.palette.primary.main,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: 60,
                          height: 60,
                          borderRadius: '50%',
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                        }}
                      >
                        {feature.icon}
                      </Box>
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                        {feature.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {feature.description}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Grid>

          {/* Right side - Auth Form */}
          <Grid item xs={12} md={6}
            component={motion.div}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Paper
              elevation={24}
              sx={{
                p: { xs: 3, sm: 6 },
                borderRadius: 4,
                backdropFilter: 'blur(10px)',
                bgcolor: alpha(theme.palette.background.paper, theme.palette.mode === 'dark' ? 0.8 : 0.9),
                boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.1)}`,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              }}
            >
              <Typography
                variant="h4"
                gutterBottom
                sx={{
                  textAlign: 'center',
                  fontWeight: 700,
                  mb: 3,
                }}
              >
                {isLogin ? 'Welcome Back!' : 'Create Account'}
              </Typography>

              <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                }}
              >
                {!isLogin && (
                  <>
                    <TextField
                      required
                      fullWidth
                      label="Username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          bgcolor: alpha(theme.palette.background.paper, 0.8),
                          '&:hover fieldset': {
                            borderColor: theme.palette.primary.main,
                          },
                        },
                      }}
                    />
                    <TextField
                      required
                      fullWidth
                      label="Display Name"
                      name="displayName"
                      value={formData.displayName}
                      onChange={handleChange}
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          bgcolor: alpha(theme.palette.background.paper, 0.8),
                          '&:hover fieldset': {
                            borderColor: theme.palette.primary.main,
                          },
                        },
                      }}
                    />
                  </>
                )}

                <TextField
                  required
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: alpha(theme.palette.background.paper, 0.8),
                      '&:hover fieldset': {
                        borderColor: theme.palette.primary.main,
                      },
                    },
                  }}
                />

                <TextField
                  required
                  fullWidth
                  label="Password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: alpha(theme.palette.background.paper, 0.8),
                      '&:hover fieldset': {
                        borderColor: theme.palette.primary.main,
                      },
                    },
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                {formError && (
                  <Alert 
                    severity="error" 
                    sx={{ 
                      borderRadius: 2,
                      bgcolor: alpha(theme.palette.error.main, 0.1),
                    }}
                  >
                    {formError}
                  </Alert>
                )}

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={isLoading}
                  sx={{
                    py: 1.5,
                    mt: 2,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: `0 8px 20px ${alpha(theme.palette.primary.main, 0.4)}`,
                    },
                  }}
                >
                  {isLoading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    isLogin ? 'Sign In' : 'Create Account'
                  )}
                </Button>

                <Divider sx={{ my: 3 }}>
                  <Typography color="text.secondary" sx={{ px: 2 }}>
                    OR
                  </Typography>
                </Divider>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {socialButtons.map(({ icon, label, color }) => (
                    <Button
                      key={label}
                      variant="outlined"
                      startIcon={icon}
                      fullWidth
                      sx={{
                        py: 1.5,
                        color: theme.palette.mode === 'dark' ? alpha(color, 0.9) : color,
                        borderColor: alpha(color, 0.3),
                        bgcolor: alpha(theme.palette.background.paper, 0.8),
                        '&:hover': {
                          borderColor: color,
                          bgcolor: alpha(color, 0.1),
                          transform: 'translateY(-1px)',
                        },
                      }}
                    >
                      {!isMobile && label}
                    </Button>
                  ))}
                </Box>

                <Box sx={{ textAlign: 'center', mt: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    {isLogin ? "Don't have an account? " : 'Already have an account? '}
                    <Button
                      color="primary"
                      onClick={() => setIsLogin(!isLogin)}
                      sx={{ 
                        textTransform: 'none',
                        fontWeight: 600,
                        '&:hover': {
                          background: 'none',
                          color: theme.palette.primary.main,
                        },
                      }}
                    >
                      {isLogin ? 'Sign Up' : 'Sign In'}
                    </Button>
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
} 