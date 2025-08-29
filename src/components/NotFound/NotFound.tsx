import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Avatar
} from '@mui/material';
import { Error, Home } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      p: 2
    }}>
      <Card sx={{ maxWidth: 400, textAlign: 'center' }}>
        <CardContent>
          <Avatar sx={{ 
            width: 80, 
            height: 80, 
            mx: 'auto', 
            mb: 2, 
            bgcolor: 'error.main' 
          }}>
            <Error sx={{ fontSize: 40 }} />
          </Avatar>
          <Typography variant="h4" gutterBottom>
            404 - Page Not Found
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            The page you're looking for doesn't exist or has been moved.
          </Typography>
          <Button
            variant="contained"
            startIcon={<Home />}
            onClick={() => navigate('/dashboard')}
            size="large"
          >
            Go Home
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default NotFound;

