import { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';

const USER_FORM_KEY = 'user_form_data';

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

export function useUserFormData() {
  const { user } = useUser();
  const [formData, setFormData] = useState<UserFormData | null>(null);
  const [hasFilledForm, setHasFilledForm] = useState(false);

  // Load form data from localStorage on mount
  useEffect(() => {
    if (user?.uid) {
      const savedData = localStorage.getItem(`${USER_FORM_KEY}_${user.uid}`);
      if (savedData) {
        setFormData(JSON.parse(savedData));
        setHasFilledForm(true);
      }
    }
  }, [user?.uid]);

  // Save form data to localStorage
  const saveFormData = (data: UserFormData) => {
    if (user?.uid) {
      localStorage.setItem(`${USER_FORM_KEY}_${user.uid}`, JSON.stringify(data));
      setFormData(data);
      setHasFilledForm(true);
    }
  };

  // Update specific fields
  const updateFormData = (updates: Partial<UserFormData>) => {
    if (formData) {
      const newData = { ...formData, ...updates };
      saveFormData(newData);
    }
  };

  return {
    formData,
    hasFilledForm,
    saveFormData,
    updateFormData,
  };
} 