import { createTheme, alpha, ThemeOptions } from '@mui/material/styles';

const baseTheme: ThemeOptions = {
  typography: {
    fontFamily: "'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif",
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    button: {
      textTransform: 'none' as const,
      fontWeight: 500,
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
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-1px)',
          },
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
  },
};

const lightPalette: ThemeOptions['palette'] = {
  mode: 'light',
  primary: {
    main: '#6366F1', // Indigo
    light: '#818CF8',
    dark: '#4F46E5',
    contrastText: '#ffffff',
  },
  secondary: {
    main: '#10B981', // Emerald
    light: '#34D399',
    dark: '#059669',
    contrastText: '#ffffff',
  },
  success: {
    main: '#22C55E', // Green
    light: '#4ADE80',
    dark: '#16A34A',
  },
  error: {
    main: '#EF4444', // Red
    light: '#F87171',
    dark: '#DC2626',
  },
  warning: {
    main: '#F59E0B', // Amber
    light: '#FBBF24',
    dark: '#D97706',
  },
  info: {
    main: '#3B82F6', // Blue
    light: '#60A5FA',
    dark: '#2563EB',
  },
  background: {
    default: '#F8FAFC',
    paper: '#FFFFFF',
  },
  text: {
    primary: '#1E293B',
    secondary: '#64748B',
  },
  divider: alpha('#64748B', 0.12),
};

const darkPalette: ThemeOptions['palette'] = {
  mode: 'dark',
  primary: {
    main: '#818CF8', // Lighter Indigo
    light: '#A5B4FC',
    dark: '#6366F1',
    contrastText: '#ffffff',
  },
  secondary: {
    main: '#34D399', // Lighter Emerald
    light: '#6EE7B7',
    dark: '#10B981',
    contrastText: '#ffffff',
  },
  success: {
    main: '#4ADE80', // Lighter Green
    light: '#86EFAC',
    dark: '#22C55E',
  },
  error: {
    main: '#F87171', // Lighter Red
    light: '#FCA5A5',
    dark: '#EF4444',
  },
  warning: {
    main: '#FBBF24', // Lighter Amber
    light: '#FCD34D',
    dark: '#F59E0B',
  },
  info: {
    main: '#60A5FA', // Lighter Blue
    light: '#93C5FD',
    dark: '#3B82F6',
  },
  background: {
    default: '#0F172A',
    paper: '#1E293B',
  },
  text: {
    primary: '#F1F5F9',
    secondary: '#94A3B8',
  },
  divider: alpha('#94A3B8', 0.12),
};

export const lightTheme = createTheme({
  ...baseTheme,
  palette: lightPalette,
});

export const darkTheme = createTheme({
  ...baseTheme,
  palette: darkPalette,
}); 