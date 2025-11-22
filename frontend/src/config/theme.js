import { createTheme } from '@mui/material/styles';

// Violet theme colors
const violetTheme = {
  light: {
    primary: '#7c3aed',
    secondary: '#8b5cf6',
    accent: '#a78bfa',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    background: '#ffffff',
    backgroundSecondary: '#f8fafc',
    text: '#0f172a',
    textSecondary: '#475569',
  },
  dark: {
    primary: '#8b5cf6',
    secondary: '#a78bfa',
    accent: '#c4b5fd',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    background: '#0f172a',
    backgroundSecondary: '#1e293b',
    text: '#f1f5f9',
    textSecondary: '#cbd5e1',
  },
};

// Get theme mode from localStorage or default to light
const getThemeMode = () => {
  const savedMode = localStorage.getItem('themeMode');
  return savedMode || 'light';
};

// Create Material UI theme
export const theme = createTheme({
  palette: {
    mode: getThemeMode(),
    primary: {
      main: violetTheme[getThemeMode()].primary,
      light: violetTheme[getThemeMode()].accent,
      dark: violetTheme[getThemeMode()].primary,
      contrastText: '#ffffff',
    },
    secondary: {
      main: violetTheme[getThemeMode()].secondary,
      light: violetTheme[getThemeMode()].accent,
      dark: violetTheme[getThemeMode()].secondary,
      contrastText: '#ffffff',
    },
    success: {
      main: violetTheme[getThemeMode()].success,
    },
    warning: {
      main: violetTheme[getThemeMode()].warning,
    },
    error: {
      main: violetTheme[getThemeMode()].error,
    },
    background: {
      default: violetTheme[getThemeMode()].background,
      paper: violetTheme[getThemeMode()].backgroundSecondary,
    },
    text: {
      primary: violetTheme[getThemeMode()].text,
      secondary: violetTheme[getThemeMode()].textSecondary,
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
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
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0px 1px 2px rgba(0, 0, 0, 0.05)',
    '0px 4px 6px rgba(0, 0, 0, 0.1)',
    '0px 10px 15px rgba(0, 0, 0, 0.1)',
    '0px 20px 25px rgba(0, 0, 0, 0.1)',
    '0px 25px 50px rgba(0, 0, 0, 0.15)',
    ...Array(19).fill('none'),
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 8,
          padding: '10px 24px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
});

export default theme;

