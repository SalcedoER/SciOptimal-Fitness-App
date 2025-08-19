import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import { QueryClient, QueryClientProvider } from 'react-query';

// Components
import Layout from './components/Layout/Layout';
import AIPoweredProfileSetup from './components/UserProfile/AIPoweredProfileSetup';
import Dashboard from './components/Dashboard/Dashboard';
import WorkoutTracker from './components/Workout/WorkoutTracker';
import NutritionTracker from './components/Nutrition/NutritionTracker';
import SleepTracker from './components/Sleep/SleepTracker';
import MacroCalculator from './components/Nutrition/MacroCalculator';
import MealPlanner from './components/Nutrition/MealPlanner';
import ProgressTracker from './components/Progress/ProgressTracker';
import TrainingPlan from './components/Training/TrainingPlan';
import Settings from './components/Settings/Settings';
import AIAssistant from './components/AIAssistant/AIAssistant';
import Reports from './components/Reports/Reports';

// Hooks
import { useUserProfile } from './store/useAppStore';

// Create theme optimized for mobile
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ffffff',
      light: '#ffffff',
      dark: '#e0e0e0',
    },
    secondary: {
      main: '#888888',
      light: '#aaaaaa',
      dark: '#666666',
    },
    background: {
      default: '#0a0a0a', // Deeper black for mobile
      paper: '#1a1a1a',   // Slightly lighter for cards
    },
    text: {
      primary: '#ffffff',
      secondary: '#cccccc',
    },
    success: {
      main: '#00c853',
      light: '#69f0ae',
      dark: '#00e676',
    },
    warning: {
      main: '#ff6d00',
      light: '#ff9e40',
      dark: '#ff3d00',
    },
    error: {
      main: '#d50000',
      light: '#ff5252',
      dark: '#b71c1c',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 500,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 12,
          fontWeight: 600,
          minHeight: 48, // Better touch target for mobile
          padding: '12px 24px',
          '&:focus': {
            outline: '2px solid rgba(255,255,255,0.5)',
            outlineOffset: '2px',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
          backdropFilter: 'blur(10px)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: 'linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 100%)',
          borderRight: '1px solid rgba(255,255,255,0.05)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          fontWeight: 500,
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          backgroundColor: 'rgba(255,255,255,0.1)',
        },
        bar: {
          borderRadius: 8,
        },
      },
    },
  },
});

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const userProfile = useUserProfile();
  
  if (!userProfile) {
    return <Navigate to="/setup" replace />;
  }
  
  return <>{children}</>;
};

// Public Route Component (redirects to dashboard if profile exists)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const userProfile = useUserProfile();
  
  if (userProfile) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
            <Routes>
              {/* Public Routes */}
              <Route 
                path="/setup" 
                element={
                  <PublicRoute>
                    <AIPoweredProfileSetup />
                  </PublicRoute>
                } 
              />
              
              {/* Protected Routes */}
              <Route 
                path="/" 
                element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="workout" element={<WorkoutTracker />} />
                <Route path="nutrition" element={<NutritionTracker />} />
                <Route path="sleep" element={<SleepTracker />} />
                <Route path="progress" element={<ProgressTracker />} />
                <Route path="training" element={<TrainingPlan />} />
                <Route path="reports" element={<Reports />} />
                <Route path="settings" element={<Settings />} />
                <Route path="ai-assistant" element={<AIAssistant />} />
              </Route>
              
              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Box>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
