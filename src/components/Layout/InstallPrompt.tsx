import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Collapse,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  GetApp,
  Close,
  PhoneIphone,
  Language,
  Share,
  Home
} from '@mui/icons-material';

const InstallPrompt: React.FC = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Check if app is already installed
    const isInstalled = window.matchMedia && window.matchMedia('(display-mode: standalone)').matches;
    
    if (!isInstalled) {
      // Listen for beforeinstallprompt event
      window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        setDeferredPrompt(e);
        setShowPrompt(true);
      });
    }
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowPrompt(false);
      }
    }
  };

  const handleClose = () => {
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <Collapse in={showPrompt}>
      <Card 
        sx={{ 
          position: 'fixed', 
          bottom: 20, 
          left: 20, 
          right: 20, 
          zIndex: 1000,
          background: 'linear-gradient(145deg, #1a1a1a 0%, #222222 100%)',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
        }}
      >
        <CardContent sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
              📱 Install SciOptimal App
            </Typography>
            <IconButton onClick={handleClose} sx={{ color: 'white' }}>
              <Close />
            </IconButton>
          </Box>
          
          <Typography variant="body2" sx={{ color: 'white', mb: 2 }}>
            Get the full app experience with offline access and home screen icon!
          </Typography>

          {/* iPhone Installation Instructions */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ color: 'primary.main', mb: 1, fontWeight: 600 }}>
              📱 iPhone Installation:
            </Typography>
            <List dense sx={{ color: 'white' }}>
              <ListItem sx={{ py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <Language fontSize="small" sx={{ color: 'primary.main' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="1. Tap the Share button in Safari" 
                  primaryTypographyProps={{ variant: 'body2' }}
                />
              </ListItem>
              <ListItem sx={{ py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <GetApp fontSize="small" sx={{ color: 'primary.main' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="2. Tap 'Add to Home Screen'" 
                  primaryTypographyProps={{ variant: 'body2' }}
                />
              </ListItem>
              <ListItem sx={{ py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <Home fontSize="small" sx={{ color: 'primary.main' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="3. Tap 'Add' to install" 
                  primaryTypographyProps={{ variant: 'body2' }}
                />
              </ListItem>
            </List>
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="contained"
              startIcon={<GetApp />}
              onClick={handleInstall}
              sx={{ 
                flex: 1,
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                color: 'white',
                fontWeight: 600
              }}
            >
              Install App
            </Button>
            <Button
              variant="outlined"
              onClick={handleClose}
              sx={{ 
                color: 'white',
                borderColor: 'rgba(255,255,255,0.3)',
                '&:hover': {
                  borderColor: 'rgba(255,255,255,0.5)'
                }
              }}
            >
              Later
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Collapse>
  );
};

export default InstallPrompt;
