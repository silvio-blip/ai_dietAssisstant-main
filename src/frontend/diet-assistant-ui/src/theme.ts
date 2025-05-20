import { createTheme } from '@mui/material/styles';

const baseTheme = {
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
    },
    h2: {
      fontWeight: 700,
      fontSize: '2rem',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 500,
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    button: {
      textTransform: 'none' as const,
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          height: 8,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 600,
        },
      },
    },
  },
};

export const lightTheme = createTheme({
  ...baseTheme,
  palette: {
    primary: {
      main: '#4A90E2', // Modern blue
      light: '#7EB6FF',
      dark: '#2C5282',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#9B51E0', // Vibrant purple
      light: '#C77DFF',
      dark: '#6B2C9E',
      contrastText: '#ffffff',
    },
    success: {
      main: '#2ECC71', // Fresh green
      light: '#5EEFA3',
      dark: '#27AE60',
      contrastText: '#ffffff',
    },
    warning: {
      main: '#F1C40F', // Warm yellow
      light: '#FFE082',
      dark: '#F39C12',
      contrastText: '#000000',
    },
    error: {
      main: '#E74C3C', // Energetic red
      light: '#FF8A80',
      dark: '#C0392B',
      contrastText: '#ffffff',
    },
    background: {
      default: '#F8FAFC',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#2D3748',
      secondary: '#718096',
    },
  },
});

export const darkTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: 'dark',
    primary: {
      main: '#60A5FA', // Softer blue for dark mode
      light: '#93C5FD',
      dark: '#2563EB',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#A78BFA', // Softer purple for dark mode
      light: '#C4B5FD',
      dark: '#7C3AED',
      contrastText: '#ffffff',
    },
    success: {
      main: '#34D399', // Softer green for dark mode
      light: '#6EE7B7',
      dark: '#059669',
      contrastText: '#000000',
    },
    warning: {
      main: '#FBBF24', // Softer yellow for dark mode
      light: '#FCD34D',
      dark: '#D97706',
      contrastText: '#000000',
    },
    error: {
      main: '#F87171', // Softer red for dark mode
      light: '#FCA5A5',
      dark: '#DC2626',
      contrastText: '#000000',
    },
    background: {
      default: '#111827', // Darker background
      paper: '#1F2937', // Slightly lighter than background for cards
    },
    text: {
      primary: '#F3F4F6', // Very light gray for primary text
      secondary: '#D1D5DB', // Lighter gray for secondary text
    },
  },
  components: {
    ...baseTheme.components,
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none', // Remove default paper background
          backgroundColor: '#1F2937',
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
          '&:hover': {
            boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#1F2937',
          backgroundImage: 'none',
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
          '&:hover': {
            boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          padding: '8px 16px',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          },
        },
        contained: {
          background: 'linear-gradient(45deg, #60A5FA 30%, #A78BFA 90%)',
          '&:hover': {
            background: 'linear-gradient(45deg, #93C5FD 30%, #C4B5FD 90%)',
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'rgba(255,255,255,0.1)',
          },
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255,255,255,0.1)',
          borderRadius: 8,
          height: 8,
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          '&:hover': {
            backgroundColor: 'rgba(255,255,255,0.05)',
          },
        },
      },
    },
  },
});

// Export the default theme as light theme for backward compatibility
export const theme = lightTheme; 