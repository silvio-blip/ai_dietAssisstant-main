import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  FormHelperText
} from '@mui/material';

const ACTIVITY_LEVELS = [
  'Sedentary',
  'Lightly Active',
  'Moderately Active',
  'Very Active'
];

const DIETARY_RESTRICTIONS = [
  'Vegan',
  'Vegetarian',
  'Gluten-Free',
  'Lactose-Free'
];

const HEALTH_CONDITIONS = [
  'Diabetes',
  'High Cholesterol',
  'None'
];

function UserForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    weight: '',
    height: '',
    activity_level: '',
    dietary_restrictions: [],
    health_conditions: []
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMultiSelect = (e, field) => {
    const { value } = e.target;
    setFormData(prev => ({
      ...prev,
      [field]: typeof value === 'string' ? value.split(',') : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      age: parseInt(formData.age),
      weight: parseFloat(formData.weight),
      height: parseFloat(formData.height)
    });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <TextField
        fullWidth
        required
        label="Age"
        name="age"
        type="number"
        value={formData.age}
        onChange={handleChange}
        sx={{ mb: 2 }}
        inputProps={{ min: 0, max: 120 }}
      />

      <FormControl fullWidth required sx={{ mb: 2 }}>
        <InputLabel>Gender</InputLabel>
        <Select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          label="Gender"
        >
          <MenuItem value="Male">Male</MenuItem>
          <MenuItem value="Female">Female</MenuItem>
          <MenuItem value="Other">Other</MenuItem>
        </Select>
      </FormControl>

      <TextField
        fullWidth
        required
        label="Weight (kg)"
        name="weight"
        type="number"
        value={formData.weight}
        onChange={handleChange}
        sx={{ mb: 2 }}
        inputProps={{ min: 0, step: 0.1 }}
      />

      <TextField
        fullWidth
        required
        label="Height (cm)"
        name="height"
        type="number"
        value={formData.height}
        onChange={handleChange}
        sx={{ mb: 2 }}
        inputProps={{ min: 0, step: 0.1 }}
      />

      <FormControl fullWidth required sx={{ mb: 2 }}>
        <InputLabel>Activity Level</InputLabel>
        <Select
          name="activity_level"
          value={formData.activity_level}
          onChange={handleChange}
          label="Activity Level"
        >
          {ACTIVITY_LEVELS.map(level => (
            <MenuItem key={level} value={level}>{level}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Dietary Restrictions</InputLabel>
        <Select
          multiple
          name="dietary_restrictions"
          value={formData.dietary_restrictions}
          onChange={(e) => handleMultiSelect(e, 'dietary_restrictions')}
          input={<OutlinedInput label="Dietary Restrictions" />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} />
              ))}
            </Box>
          )}
        >
          {DIETARY_RESTRICTIONS.map(restriction => (
            <MenuItem key={restriction} value={restriction}>
              {restriction}
            </MenuItem>
          ))}
        </Select>
        <FormHelperText>Optional: Select any dietary restrictions</FormHelperText>
      </FormControl>

      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Health Conditions</InputLabel>
        <Select
          multiple
          name="health_conditions"
          value={formData.health_conditions}
          onChange={(e) => handleMultiSelect(e, 'health_conditions')}
          input={<OutlinedInput label="Health Conditions" />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} />
              ))}
            </Box>
          )}
        >
          {HEALTH_CONDITIONS.map(condition => (
            <MenuItem key={condition} value={condition}>
              {condition}
            </MenuItem>
          ))}
        </Select>
        <FormHelperText>Optional: Select any health conditions</FormHelperText>
      </FormControl>

      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        size="large"
      >
        Generate Diet Plan
      </Button>
    </Box>
  );
}

export default UserForm; 