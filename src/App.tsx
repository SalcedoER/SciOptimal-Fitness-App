import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Layout from './components/Layout/Layout';
import Dashboard from './components/Dashboard/Dashboard';
import UserProfileSetup from './components/UserProfile/UserProfileSetup';
import AIPoweredProfileSetup from './components/UserProfile/AIPoweredProfileSetup';
import WorkoutTracker from './components/Workout/WorkoutTracker';
import NutritionTracker from './components/Nutrition/NutritionTracker';
import MacroCalculator from './components/Nutrition/MacroCalculator';
import MealPlanner from './components/Nutrition/MealPlanner';
import SleepTracker from './components/Sleep/SleepTracker';
import ProgressTracker from './components/Progress/ProgressTracker';
import Reports from './components/Reports/Reports';
import Settings from './components/Settings/Settings';
import AIAssistant from './components/AIAssistant/AIAssistant';
import TrainingPlan from './components/Training/TrainingPlan';
import BodyDiagram from './components/BodyDiagram/BodyDiagram';
import NotFound from './components/NotFound/NotFound';
import { useUserProfile, useLoadUserData } from './store/useAppStore';

// Create a black and white monochrome Material-UI theme
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ffffff',
      light: '#f5f5f5',
      dark: '#cccccc',
      contrastText: '#000000',
    },
    secondary: {
      main: '#cccccc',
      light: '#e0e0e0',
      dark: '#999999',
      contrastText: '#000000',
    },
    background: {
      default: '#000000',
      paper: '#111111',
    },
    text: {
      primary: '#ffffff',
      secondary: '#cccccc',
    },
    divider: '#333333',
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      color: '#ffffff',
      fontWeight: 700,
    },
    h2: {
      color: '#ffffff',
      fontWeight: 600,
    },
    h3: {
      color: '#ffffff',
      fontWeight: 600,
    },
    h4: {
      color: '#ffffff',
      fontWeight: 500,
    },
    h5: {
      color: '#ffffff',
      fontWeight: 500,
    },
    h6: {
      color: '#ffffff',
      fontWeight: 500,
    },
    body1: {
      color: '#ffffff',
    },
    body2: {
      color: '#cccccc',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          textTransform: 'none',
          fontWeight: 600,
          '&.MuiButton-contained': {
            backgroundColor: '#ffffff',
            color: '#000000',
            '&:hover': {
              backgroundColor: '#f0f0f0',
            },
          },
          '&.MuiButton-outlined': {
            borderColor: '#ffffff',
            color: '#ffffff',
            '&:hover': {
              backgroundColor: '#333333',
            },
          },
          '&.MuiButton-text': {
            color: '#ffffff',
            '&:hover': {
              backgroundColor: '#333333',
            },
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          border: '1px solid #333333',
          backgroundColor: '#111111',
          boxShadow: '0 2px 8px rgba(255,255,255,0.1)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          backgroundColor: '#111111',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#000000',
          color: '#ffffff',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#111111',
          borderRight: '1px solid #333333',
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            backgroundColor: '#333333',
            '&:hover': {
              backgroundColor: '#444444',
            },
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 0,
            backgroundColor: '#111111',
            '& fieldset': {
              borderColor: '#333333',
            },
            '&:hover fieldset': {
              borderColor: '#ffffff',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#ffffff',
            },
          },
        },
      },
    },
  },
});

// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const userProfile = useUserProfile();
  const loadUserData = useLoadUserData();
  const [hasAttemptedLoad, setHasAttemptedLoad] = React.useState(false);
  
  React.useEffect(() => {
    if (!userProfile && !hasAttemptedLoad) {
      setHasAttemptedLoad(true);
      // Try to load user data once
      loadUserData().catch(() => {
        // If loading fails, just continue - the redirect will happen below
      });
    }
  }, [userProfile, loadUserData, hasAttemptedLoad]);

  // If no user profile after attempting to load, redirect to setup
  if (!userProfile && hasAttemptedLoad) {
    return <Navigate to="/setup" replace />;
  }

  // Show loading only briefly while attempting to load
  if (!userProfile) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px',
        color: '#ffffff'
      }}>
        Loading...
      </div>
    );
  }

  return <>{children}</>;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/setup" element={<UserProfileSetup />} />
          <Route path="/ai-setup" element={<AIPoweredProfileSetup />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="workout" element={<WorkoutTracker />} />
            <Route path="nutrition" element={<NutritionTracker />} />
            <Route path="macros" element={<MacroCalculator />} />
            <Route path="meal-planner" element={<MealPlanner />} />
            <Route path="sleep" element={<SleepTracker />} />
            <Route path="progress" element={<ProgressTracker />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
            <Route path="ai-assistant" element={<AIAssistant />} />
            <Route path="training-plan" element={<TrainingPlan />} />
            <Route path="body-diagram" element={<BodyDiagram />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
