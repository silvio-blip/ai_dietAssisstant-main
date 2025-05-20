import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CircularProgress, Typography, Button } from '@mui/material';
import Box from '@mui/material/Box';
import { UserProvider, useUser } from './contexts/UserContext';
import { ProgressProvider } from './contexts/ProgressContext';
import { NotificationProvider } from './contexts/NotificationContext';
import Navigation from './components/Navigation';
import AuthPage from './components/Auth/AuthPage';
import UserForm from './components/UserForm';
import DietPlanView from './components/DietPlan';
import Dashboard from './components/Dashboard';
import Progress from './components/Progress';
import Achievements from './components/Achievements';
import LoadingAnimation from './components/LoadingAnimation';
import { lightTheme, darkTheme } from './theme';
import { generateDietPlan } from './api/mockApi';
import type { DietPlan as DietPlanType } from './api/mockApi';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading, hasCompletedForm } = useUser();
  const location = useLocation();

  if (isLoading) {
    return (
      <Box sx={{ 
        width: '100vw', 
        height: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <LoadingAnimation message="Loading your profile..." />
      </Box>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // If user hasn't completed the initial form, redirect to form
  if (!hasCompletedForm && location.pathname !== '/form') {
    return <Navigate to="/form" replace />;
  }

  return <>{children}</>;
}

function ThemedApp() {
  const { isDarkMode, user, hasCompletedForm, updateUserData } = useUser();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [dietPlan, setDietPlan] = React.useState<DietPlanType | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleFormSubmit = (formData: any) => {
    updateUserData(formData);
  };

  // Fetch diet plan when user data is available
  useEffect(() => {
    const generatePlan = async () => {
      // Don't proceed if user or userData is not available
      if (!user || !user.userData) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const dietPlanData = await generateDietPlan(user.userData);
        if (!dietPlanData || !dietPlanData.meals || !dietPlanData.nutrition || !dietPlanData.shoppingList) {
          throw new Error('Invalid diet plan data received');
        }
        setDietPlan(dietPlanData);
      } catch (err) {
        console.error('Error generating diet plan:', err);
        setError(err instanceof Error ? err.message : 'Failed to generate diet plan');
      } finally {
        setIsLoading(false);
      }
    };

    generatePlan();
  }, [user]);

  // Determine current page based on path
  const getCurrentPage = () => {
    const path = window.location.pathname;
    if (path === '/form') return 'form';
    if (path === '/plan') return 'plan';
    if (path === '/progress') return 'progress';
    if (path === '/achievements') return 'achievements';
    return 'dashboard';
  };
  
  if (!user) {
    return (
      <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
        <CssBaseline />
        <AuthPage />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <Box sx={{ display: 'flex' }}>
        <Navigation 
          currentPage={getCurrentPage()} 
          isOpen={isSidebarOpen}
          onToggle={toggleSidebar}
          showBackButton={getCurrentPage() === 'plan'}
        />
        <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
          <Routes>
            <Route 
              path="/form" 
              element={
                <ProtectedRoute>
                  <UserForm onSubmit={handleFormSubmit} />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/plan" 
              element={
                <ProtectedRoute>
                  {isLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                      <CircularProgress />
                    </Box>
                  ) : error ? (
                    <Box sx={{ p: 3, textAlign: 'center' }}>
                      <Typography color="error" gutterBottom>
                        {error}
                      </Typography>
                      <Button variant="contained" onClick={() => window.location.reload()}>
                        Retry
                      </Button>
                    </Box>
                  ) : (
                    <DietPlanView 
                      dietPlan={dietPlan} 
                      onBack={() => window.history.back()} 
                    />
                  )}
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/progress" 
              element={
                <ProtectedRoute>
                  <Progress />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/achievements" 
              element={
                <ProtectedRoute>
                  <Achievements />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/" 
              element={
                <Navigate 
                  to={hasCompletedForm ? "/dashboard" : "/form"} 
                  replace 
                />
              } 
            />
          </Routes>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <ProgressProvider>
          <NotificationProvider>
            <Routes>
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/*" element={<ThemedApp />} />
            </Routes>
          </NotificationProvider>
        </ProgressProvider>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
