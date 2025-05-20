import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Test account credentials for development
const TEST_ACCOUNT = {
  email: 'test@example.com',
  password: 'test123',
  id: '1',
  displayName: 'Test User',
  photoURL: null,
  preferences: {
    theme: 'light' as const,
    notifications: true,
    language: 'en',
  },
};

export interface UserData {
  age: number;
  gender: string;
  weight: number;
  height: number;
  activity_level: string;
  dietary_restrictions: string[];
  health_conditions: string[];
  preferred_cuisine: string;
  current_mood: string;
  calorieGoal: number;
  proteinGoal: number;
  carbsGoal: number;
  fatGoal: number;
}

interface User {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  userData?: UserData;
}

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  isDarkMode: boolean;
  hasCompletedForm: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
  toggleTheme: () => void;
  updateUserData: (data: UserData) => Promise<void>;
  getUserData: () => UserData | undefined;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('isDarkMode');
    return saved ? JSON.parse(saved) : false;
  });
  const navigate = useNavigate();

  // Check if user has completed the initial form
  const hasCompletedForm = user?.userData !== undefined;

  useEffect(() => {
    // Check for saved user data
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    localStorage.setItem('isDarkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Mock login - replace with actual authentication
      const mockUser: User = {
        uid: '123',
        email,
        displayName: email.split('@')[0],
        photoURL: null,
        // Check if we have saved user data
        userData: JSON.parse(localStorage.getItem(`userData_${email}`) || 'null'),
      };
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      navigate(mockUser.userData ? '/dashboard' : '/form');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, displayName: string) => {
    setIsLoading(true);
    try {
      // Mock registration - replace with actual authentication
      const mockUser: User = {
        uid: '123',
        email,
        displayName,
        photoURL: null,
      };
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      navigate('/form');
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem('user');
    navigate('/auth');
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const updateUserData = async (data: UserData) => {
    if (!user) return;
    
    const updatedUser = {
      ...user,
      userData: data,
    };
    
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    localStorage.setItem(`userData_${user.email}`, JSON.stringify(data));
    navigate('/dashboard');
  };

  const getUserData = () => {
    return user?.userData;
  };

  return (
    <UserContext.Provider
      value={{
        user,
        isLoading,
        isDarkMode,
        hasCompletedForm,
        login,
        register,
        logout,
        toggleTheme,
        updateUserData,
        getUserData,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
} 