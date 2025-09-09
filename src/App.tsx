import React from 'react';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Box,
  AppBar,
  Toolbar,
  Typography,
  Container,
  Card,
  CardContent,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  Fab,
  Chip,
  Avatar,
  Divider,
  Menu
} from '@mui/material';
import {
  FitnessCenter,
  Speed,
  Science,
  CloudSync,
  HealthAndSafety,
  Settings,
  Menu as MenuIcon
} from '@mui/icons-material';
import { useAppStore } from './store';
import EnhancedDashboard from './components/EnhancedDashboard';
import AIOptimizationPanel from './components/AIOptimizationPanel';
import AuthModal from './components/AuthModal';
import ResearchPanel from './components/ResearchPanel';
import ProfileSetup from './components/ProfileSetup';
import './App.css';

// Create a comprehensive theme
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ffffff',
    },
    secondary: {
      main: '#ffffff',
    },
    background: {
      default: '#000000',
      paper: '#000000',
    },
    text: {
      primary: '#ffffff',
      secondary: '#ffffff',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: '#000000 !important',
          color: '#ffffff !important',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: '#000000 !important',
          border: '1px solid #333333 !important',
          color: '#ffffff !important',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: '#000000 !important',
          borderBottom: '1px solid #333333 !important',
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          color: '#ffffff !important',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          background: '#333333 !important',
          color: '#ffffff !important',
        },
      },
    },
  },
});

// Error Boundary Component
class ErrorBoundary extends React.Component<any, { hasError: boolean; error: any }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Box sx={{ 
            minHeight: '100vh',
            background: '#000000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 3
          }}>
            <Card sx={{ 
              maxWidth: 400,
              width: '100%',
              background: '#000000',
              border: '1px solid #333333',
              borderRadius: '16px'
            }}>
              <CardContent sx={{ textAlign: 'center', p: 4 }}>
                <Typography variant="h4" sx={{ color: '#ffffff', mb: 2 }}>
                  Something went wrong
                </Typography>
                <Typography variant="body2" sx={{ color: '#ffffff', mb: 3 }}>
                  Please refresh the page to try again
                </Typography>
                <Button 
                  variant="contained" 
                  onClick={() => window.location.reload()}
                  sx={{ 
                    background: '#ffffff',
                    color: '#000000',
                    '&:hover': {
                      background: '#cccccc'
                    }
                  }}
                >
                  Refresh Page
                </Button>
              </CardContent>
            </Card>
          </Box>
        </ThemeProvider>
      );
    }

    return this.props.children;
  }
}

// Main App Component
function App() {
  const {
    isAuthenticated,
    user,
    userProfile,
    currentTab,
    setCurrentTab,
    showAuthModal,
    setShowAuthModal,
    authLoading,
    authError,
    logout,
    loadUserData,
    login,
    register
  } = useAppStore();

  const [mobileOpen, setMobileOpen] = React.useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Load user data when authenticated
  React.useEffect(() => {
    if (isAuthenticated && !userProfile) {
      loadUserData().catch(console.error);
    }
  }, [isAuthenticated, userProfile, loadUserData]);

  // Navigation items
  const navigationItems = [
    { label: 'Dashboard', icon: <FitnessCenter />, value: 0 },
    { label: 'Optimize', icon: <Speed />, value: 1 },
    { label: 'Research', icon: <Science />, value: 2 },
  ];

  // Drawer content
  const drawer = (
    <Box sx={{ width: 250, height: '100%', background: '#000000', color: '#ffffff' }}>
      <Toolbar>
        <Typography variant="h6" sx={{ color: '#ffffff !important' }}>
          SciOptimal
        </Typography>
      </Toolbar>
      <Divider sx={{ borderColor: '#333333' }} />
      <List>
        {navigationItems.map((item) => (
          <ListItem
            key={item.label}
            button
            onClick={() => {
              setCurrentTab(item.value);
              if (isMobile) setMobileOpen(false);
            }}
            selected={currentTab === item.value}
            sx={{
              '&.Mui-selected': {
                backgroundColor: '#333333',
              },
            }}
          >
            <ListItemIcon sx={{ color: '#ffffff' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
      </List>
      <Divider sx={{ borderColor: '#333333' }} />
      <List>
        <ListItem button onClick={logout}>
          <ListItemIcon sx={{ color: '#ffffff' }}>
            <Settings />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </Box>
  );

  // Render content based on tab
  const renderTabContent = () => {
    try {
      switch (currentTab) {
        case 0:
          return <EnhancedDashboard />;
        case 1:
          return <AIOptimizationPanel />;
        case 2:
          return <ResearchPanel />;
        default:
          return <EnhancedDashboard />;
      }
    } catch (error) {
      console.error('Error rendering tab content:', error);
      return (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" sx={{ color: '#ffffff' }}>
            Error loading content
          </Typography>
        </Box>
      );
    }
  };

  // Welcome screen for unauthenticated users
  if (!isAuthenticated) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ 
          minHeight: '100vh',
          background: '#000000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 3
        }}>
          <Card sx={{ 
            maxWidth: 400,
            width: '100%',
            background: '#000000',
            border: '1px solid #333333',
            borderRadius: '16px'
          }}>
            <CardContent sx={{ textAlign: 'center', p: 4 }}>
              <FitnessCenter sx={{ fontSize: 64, color: '#ffffff', mb: 2 }} />
              <Typography variant="h4" sx={{ color: '#ffffff !important', mb: 1 }}>
                SciOptimal
              </Typography>
              <Typography variant="h6" sx={{ color: '#ffffff !important', mb: 3 }}>
                AI-Powered Fitness
              </Typography>
              <Typography variant="body2" sx={{ color: '#ffffff', mb: 3 }}>
                Sign in to access your personalized fitness journey
              </Typography>
              <Button 
                variant="contained" 
                size="large"
                onClick={() => setShowAuthModal(true)}
                sx={{ 
                  background: '#ffffff',
                  color: '#000000',
                  '&:hover': {
                    background: '#cccccc'
                  }
                }}
              >
                Get Started
              </Button>
            </CardContent>
          </Card>
        </Box>
        
        <AuthModal 
          open={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onLogin={login}
          onRegister={register}
          loading={authLoading}
          error={authError}
        />
      </ThemeProvider>
    );
  }

  // Profile setup for authenticated users without profile
  if (isAuthenticated && !userProfile) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ProfileSetup />
      </ThemeProvider>
    );
  }

  // Main app interface
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100vh', background: '#000000' }}>
        {/* App Bar */}
        <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div" sx={{ color: '#ffffff !important' }}>
              SciOptimal Fitness
            </Typography>
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Chip
                icon={<HealthAndSafety />}
                label="Health Connected"
                color="primary"
                variant="outlined"
                sx={{ color: '#ffffff', borderColor: '#333333' }}
              />
              <Avatar sx={{ bgcolor: '#333333' }}>
                {user?.name?.charAt(0) || 'U'}
              </Avatar>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Navigation Drawer */}
        <Box
          component="nav"
          sx={{ width: { md: 250 }, flexShrink: { md: 0 } }}
        >
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true,
            }}
            sx={{
              display: { xs: 'block', md: 'none' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 250 },
            }}
          >
            {drawer}
          </Drawer>
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', md: 'block' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 250 },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { md: `calc(100% - 250px)` },
            mt: 8,
            background: '#000000',
            minHeight: '100vh'
          }}
        >
          <Container maxWidth="xl">
            {renderTabContent()}
          </Container>
        </Box>

        {/* Floating Action Button for Health Sync */}
        <Fab
          color="primary"
          aria-label="sync health data"
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            background: '#ffffff',
            color: '#000000',
            '&:hover': {
              background: '#cccccc',
            },
          }}
        >
          <CloudSync />
        </Fab>
      </Box>

      {/* Auth Modal */}
      <AuthModal 
        open={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLogin={login}
        onRegister={register}
        loading={authLoading}
        error={authError}
      />
    </ThemeProvider>
  );
}

// Wrap App with Error Boundary
function AppWithErrorBoundary() {
  return (
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
}

export default AppWithErrorBoundary;