import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Stepper,
  Step,
  StepLabel,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Slider,
  Chip,
  Stack,
  useTheme,
  alpha,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  ArrowForward as ArrowForwardIcon,
  ArrowBack as ArrowBackIcon,
  EmojiEvents,
  Restaurant,
  FitnessCenter,
  Favorite,
  Info as InfoIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

interface FormState {
  age: number;
  gender: string;
  weight: number;
  height: number;
  activityLevel: string;
  dietaryRestrictions: string[];
  healthConditions: string[];
  goal: string;
}

interface UserFormData {
  age: number;
  gender: string;
  weight: number;
  height: number;
  activity_level: string;
  dietary_restrictions: string[];
  health_conditions: string[];
  preferred_cuisine: string;
  current_mood: string;
}

interface UserFormProps {
  onSubmit: (data: UserFormData) => void;
}

const dietaryOptions = [
  'Vegetarian',
  'Vegan',
  'Gluten-Free',
  'Dairy-Free',
  'Keto',
  'Paleo',
  'Mediterranean',
  'Low-Carb',
  'Low-Fat',
];

const healthConditions = [
  'Diabetes',
  'Hypertension',
  'Heart Disease',
  'Celiac Disease',
  'Lactose Intolerance',
  'Food Allergies',
  'None',
];

const activityLevels = [
  { value: 'sedentary', label: 'Sedentary', description: 'Little or no exercise' },
  { value: 'light', label: 'Lightly Active', description: '1-3 days/week' },
  { value: 'moderate', label: 'Moderately Active', description: '3-5 days/week' },
  { value: 'very', label: 'Very Active', description: '6-7 days/week' },
  { value: 'extra', label: 'Extra Active', description: 'Very intense exercise daily' },
];

const goals = [
  { value: 'lose', label: 'Weight Loss', icon: <FitnessCenter /> },
  { value: 'maintain', label: 'Maintain Weight', icon: <Restaurant /> },
  { value: 'gain', label: 'Gain Muscle', icon: <EmojiEvents /> },
  { value: 'health', label: 'Improve Health', icon: <Favorite /> },
];

export default function UserForm({ onSubmit }: UserFormProps) {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<FormState>({
    age: 25,
    gender: '',
    weight: 70,
    height: 170,
    activityLevel: '',
    dietaryRestrictions: [],
    healthConditions: [],
    goal: '',
  });

  const steps = ['Basic Info', 'Activity Level', 'Diet & Health', 'Goals'];

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const submissionData: UserFormData = {
      age: formData.age,
      gender: formData.gender,
      weight: formData.weight,
      height: formData.height,
      activity_level: formData.activityLevel,
      dietary_restrictions: formData.dietaryRestrictions,
      health_conditions: formData.healthConditions,
      preferred_cuisine: 'any',
      current_mood: 'neutral',
    };
    onSubmit(submissionData);
  };

  const handleDietaryToggle = (diet: string) => {
    setFormData((prev) => ({
      ...prev,
      dietaryRestrictions: prev.dietaryRestrictions.includes(diet)
        ? prev.dietaryRestrictions.filter((d) => d !== diet)
        : [...prev.dietaryRestrictions, diet],
    }));
  };

  const handleHealthToggle = (condition: string) => {
    setFormData((prev) => ({
      ...prev,
      healthConditions: prev.healthConditions.includes(condition)
        ? prev.healthConditions.filter((c) => c !== condition)
        : [...prev.healthConditions, condition],
    }));
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Stack spacing={4}>
              <Box>
                <Typography variant="h6" gutterBottom>
                  Tell us about yourself
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  We'll use this information to create your personalized diet plan
                </Typography>
              </Box>

              <FormControl fullWidth>
                <FormLabel>Gender</FormLabel>
                <RadioGroup
                  row
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                >
                  <FormControlLabel value="male" control={<Radio />} label="Male" />
                  <FormControlLabel value="female" control={<Radio />} label="Female" />
                  <FormControlLabel value="other" control={<Radio />} label="Other" />
                </RadioGroup>
              </FormControl>

              <Box>
                <Typography gutterBottom>Age</Typography>
                <Slider
                  value={formData.age}
                  onChange={(_, value) => setFormData({ ...formData, age: value as number })}
                  min={15}
                  max={100}
                  marks={[
                    { value: 15, label: '15' },
                    { value: 100, label: '100' },
                  ]}
                  valueLabelDisplay="auto"
                />
              </Box>

              <Stack direction="row" spacing={2}>
                <TextField
                  label="Weight (kg)"
                  type="number"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: Number(e.target.value) })}
                  fullWidth
                />
                <TextField
                  label="Height (cm)"
                  type="number"
                  value={formData.height}
                  onChange={(e) => setFormData({ ...formData, height: Number(e.target.value) })}
                  fullWidth
                />
              </Stack>
            </Stack>
          </motion.div>
        );

      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Stack spacing={4}>
              <Box>
                <Typography variant="h6" gutterBottom>
                  What's your activity level?
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  This helps us calculate your daily calorie needs
                </Typography>
              </Box>

              <Stack spacing={2}>
                {activityLevels.map((level) => (
                  <Paper
                    key={level.value}
                    onClick={() => setFormData({ ...formData, activityLevel: level.value })}
                    sx={{
                      p: 2,
                      cursor: 'pointer',
                      border: 2,
                      borderColor: formData.activityLevel === level.value ? 'primary.main' : 'transparent',
                      bgcolor: formData.activityLevel === level.value 
                        ? alpha(theme.palette.primary.main, 0.1)
                        : 'background.paper',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        bgcolor: alpha(theme.palette.primary.main, 0.05),
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: formData.activityLevel === level.value 
                            ? 'primary.main'
                            : alpha(theme.palette.primary.main, 0.1),
                        }}
                      >
                        <FitnessCenter
                          sx={{
                            color: formData.activityLevel === level.value 
                              ? 'white'
                              : 'primary.main',
                          }}
                        />
                      </Box>
                      <Box>
                        <Typography variant="subtitle1" fontWeight={500}>
                          {level.label}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {level.description}
                        </Typography>
                      </Box>
                    </Stack>
                  </Paper>
                ))}
              </Stack>
            </Stack>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Stack spacing={4}>
              <Box>
                <Typography variant="h6" gutterBottom>
                  Dietary Preferences & Health
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Help us understand your dietary needs and health conditions
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Dietary Restrictions
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {dietaryOptions.map((diet) => (
                    <Chip
                      key={diet}
                      label={diet}
                      onClick={() => handleDietaryToggle(diet)}
                      color={formData.dietaryRestrictions.includes(diet) ? 'primary' : 'default'}
                      sx={{
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                        },
                      }}
                    />
                  ))}
                </Box>
              </Box>

              <Box>
                <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  Health Conditions
                  <Tooltip title="This information helps us provide safer meal recommendations">
                    <IconButton size="small">
                      <InfoIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {healthConditions.map((condition) => (
                    <Chip
                      key={condition}
                      label={condition}
                      onClick={() => handleHealthToggle(condition)}
                      color={formData.healthConditions.includes(condition) ? 'primary' : 'default'}
                      sx={{
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                        },
                      }}
                    />
                  ))}
                </Box>
              </Box>
            </Stack>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Stack spacing={4}>
              <Box>
                <Typography variant="h6" gutterBottom>
                  What's your primary goal?
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  We'll tailor your diet plan to help you achieve this goal
                </Typography>
              </Box>

              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 2 }}>
                {goals.map((goal) => (
                  <Paper
                    key={goal.value}
                    onClick={() => setFormData({ ...formData, goal: goal.value })}
                    sx={{
                      p: 3,
                      cursor: 'pointer',
                      border: 2,
                      borderColor: formData.goal === goal.value ? 'primary.main' : 'transparent',
                      bgcolor: formData.goal === goal.value 
                        ? alpha(theme.palette.primary.main, 0.1)
                        : 'background.paper',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        bgcolor: alpha(theme.palette.primary.main, 0.05),
                        transform: 'translateY(-2px)',
                      },
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 2,
                    }}
                  >
                    <Box
                      sx={{
                        width: 64,
                        height: 64,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: formData.goal === goal.value 
                          ? 'primary.main'
                          : alpha(theme.palette.primary.main, 0.1),
                      }}
                    >
                      {React.cloneElement(goal.icon, {
                        sx: {
                          fontSize: 32,
                          color: formData.goal === goal.value ? 'white' : 'primary.main',
                        },
                      })}
                    </Box>
                    <Typography variant="h6" align="center">
                      {goal.label}
                    </Typography>
                  </Paper>
                ))}
              </Box>
            </Stack>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
          flex: 1,
          borderRadius: 0,
        }}
      >
        <Stepper
          activeStep={activeStep}
          sx={{
            '& .MuiStepLabel-root .Mui-completed': {
              color: 'primary.main',
            },
            '& .MuiStepLabel-label.Mui-completed.MuiStepLabel-alternativeLabel': {
              color: 'primary.main',
            },
            '& .MuiStepLabel-root .Mui-active': {
              color: 'primary.main',
            },
          }}
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ mt: 4, flex: 1 }}>
          {getStepContent(activeStep)}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 2 }}>
          <Button
            onClick={handleBack}
            disabled={activeStep === 0}
            startIcon={<ArrowBackIcon />}
            sx={{ 
              visibility: activeStep === 0 ? 'hidden' : 'visible',
              '&.MuiButton-root': { gap: 1 },
            }}
          >
            Back
          </Button>
          {activeStep === steps.length - 1 ? (
            <Button
              type="submit"
              variant="contained"
              endIcon={<ArrowForwardIcon />}
              sx={{ 
                minWidth: 200,
                '&.MuiButton-root': { gap: 1 },
              }}
            >
              Create My Plan
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              variant="contained"
              endIcon={<ArrowForwardIcon />}
              sx={{ 
                minWidth: 200,
                '&.MuiButton-root': { gap: 1 },
              }}
            >
              Continue
            </Button>
          )}
        </Box>
      </Paper>
    </Box>
  );
} 