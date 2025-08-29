import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Alert,
  Switch,
  FormControlLabel,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  IconButton,
  Tooltip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Slider,
  Tabs,
  Tab
} from '@mui/material';
import {
  Person,
  Notifications,
  Security,
  Palette,
  FitnessCenter,
  DataUsage,
  Help,
  Info,
  Edit,
  Save,
  Cancel,
  Delete,
  Backup,
  Restore,
  ExpandMore,
  Brightness4,
  Brightness7,
  VolumeUp,
  VolumeOff,
  Email,
  Phone,
  LocationOn,
  AccessTime,
  Language,
  Public,
  Lock,
  TrendingUp,
  Assessment
} from '@mui/icons-material';
import { useUserProfile, useSetUserProfile, useLogout } from '../../store/useAppStore';
import { UserProfile, ActivityLevel, Equipment } from '../../types';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const Settings: React.FC = () => {
  const userProfile = useUserProfile();
  const setUserProfile = useSetUserProfile();
  const logout = useLogout();
  const [tabValue, setTabValue] = useState(0);
  const [editProfile, setEditProfile] = useState(false);
  const [profileData, setProfileData] = useState<Partial<UserProfile>>(userProfile || {});
  const [notifications, setNotifications] = useState({
    workoutReminders: true,
    nutritionReminders: true,
    progressUpdates: true,
    weeklyReports: false,
    emailNotifications: true,
    pushNotifications: true
  });
  const [appSettings, setAppSettings] = useState({
    theme: 'dark',
    language: 'en',
    units: 'imperial',
    autoBackup: true,
    dataSharing: false,
    analytics: true
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleProfileSave = () => {
    if (userProfile) {
      setUserProfile({
        ...userProfile,
        ...profileData,
        updatedAt: new Date()
      });
      setEditProfile(false);
    }
  };

  const handleProfileCancel = () => {
    setProfileData(userProfile || {});
    setEditProfile(false);
  };

  const handleDeleteAccount = () => {
    // Clear all data and redirect to setup
    logout();
    setDeleteDialogOpen(false);
  };

  const handleExportData = () => {
    const dataStr = JSON.stringify({
      userProfile,
      timestamp: new Date().toISOString()
    }, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `scioptimal-data-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          if (data.userProfile) {
            setUserProfile(data.userProfile);
          }
        } catch (error) {
          console.error('Error importing data:', error);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
        Settings
      </Typography>
      
      {/* Settings Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="settings tabs">
          <Tab label="Profile" />
          <Tab label="Notifications" />
          <Tab label="App Settings" />
          <Tab label="Data & Privacy" />
        </Tabs>
      </Box>

      {/* Profile Tab */}
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Personal Information
                  </Typography>
                  <Button
                    variant={editProfile ? 'outlined' : 'contained'}
                    startIcon={editProfile ? <Cancel /> : <Edit />}
                    onClick={() => editProfile ? handleProfileCancel() : setEditProfile(true)}
                  >
                    {editProfile ? 'Cancel' : 'Edit Profile'}
                  </Button>
                </Box>

                {editProfile ? (
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Name"
                        value={profileData.name || ''}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        disabled={!editProfile}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Age"
                        type="number"
                        value={profileData.age || ''}
                        onChange={(e) => setProfileData({ ...profileData, age: Number(e.target.value) })}
                        disabled={!editProfile}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Height (inches)"
                        type="number"
                        value={profileData.height || ''}
                        onChange={(e) => setProfileData({ ...profileData, height: Number(e.target.value) })}
                        disabled={!editProfile}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Weight (lbs)"
                        type="number"
                        value={profileData.weight || ''}
                        onChange={(e) => setProfileData({ ...profileData, weight: Number(e.target.value) })}
                        disabled={!editProfile}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel>Activity Level</InputLabel>
                        <Select
                          value={profileData.activityLevel || 'moderately_active'}
                          onChange={(e) => setProfileData({ ...profileData, activityLevel: e.target.value as ActivityLevel })}
                          disabled={!editProfile}
                        >
                          <MenuItem value="sedentary">Sedentary</MenuItem>
                          <MenuItem value="lightly_active">Lightly Active</MenuItem>
                          <MenuItem value="moderately_active">Moderately Active</MenuItem>
                          <MenuItem value="very_active">Very Active</MenuItem>
                          <MenuItem value="extremely_active">Extremely Active</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Body Fat %"
                        type="number"
                        value={profileData.bodyFatPercentage || ''}
                        onChange={(e) => setProfileData({ ...profileData, bodyFatPercentage: Number(e.target.value) })}
                        disabled={!editProfile}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                        <Button variant="outlined" onClick={handleProfileCancel}>
                          Cancel
                        </Button>
                        <Button variant="contained" onClick={handleProfileSave}>
                          Save Changes
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                ) : (
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">Name</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>{userProfile?.name || 'Not set'}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">Age</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>{userProfile?.age || 'Not set'}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">Height</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>{userProfile?.height ? `${userProfile.height} inches` : 'Not set'}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">Weight</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>{userProfile?.weight ? `${userProfile.weight} lbs` : 'Not set'}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">Activity Level</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {userProfile?.activityLevel ? userProfile.activityLevel.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Not set'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">Body Fat %</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>{userProfile?.bodyFatPercentage ? `${userProfile.bodyFatPercentage}%` : 'Not set'}</Typography>
                    </Grid>
                  </Grid>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Quick Actions
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Button
                    variant="outlined"
                    startIcon={<Backup />}
                    fullWidth
                    onClick={handleExportData}
                  >
                    Export Data
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Restore />}
                    fullWidth
                    component="label"
                  >
                    Import Data
                    <input
                      type="file"
                      accept=".json"
                      hidden
                      onChange={handleImportData}
                    />
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Delete />}
                    fullWidth
                    color="error"
                    onClick={() => setDeleteDialogOpen(true)}
                  >
                    Delete Account
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Notifications Tab */}
      <TabPanel value={tabValue} index={1}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Workout & Fitness
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <FitnessCenter />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Workout Reminders"
                      secondary="Get notified before scheduled workouts"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        edge="end"
                        checked={notifications.workoutReminders}
                        onChange={(e) => setNotifications({ ...notifications, workoutReminders: e.target.checked })}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <TrendingUp />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Progress Updates"
                      secondary="Weekly progress summaries and achievements"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        edge="end"
                        checked={notifications.progressUpdates}
                        onChange={(e) => setNotifications({ ...notifications, progressUpdates: e.target.checked })}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Assessment />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Weekly Reports"
                      secondary="Detailed weekly performance reports"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        edge="end"
                        checked={notifications.weeklyReports}
                        onChange={(e) => setNotifications({ ...notifications, weeklyReports: e.target.checked })}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Communication Preferences
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <Email />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Email Notifications"
                      secondary="Receive updates via email"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        edge="end"
                        checked={notifications.emailNotifications}
                        onChange={(e) => setNotifications({ ...notifications, emailNotifications: e.target.checked })}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Phone />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Push Notifications"
                      secondary="In-app and browser notifications"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        edge="end"
                        checked={notifications.pushNotifications}
                        onChange={(e) => setNotifications({ ...notifications, pushNotifications: e.target.checked })}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* App Settings Tab */}
      <TabPanel value={tabValue} index={2}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Appearance & Language
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <Palette />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Theme"
                      secondary="Choose your preferred app theme"
                    />
                    <ListItemSecondaryAction>
                      <FormControl size="small">
                        <Select
                          value={appSettings.theme}
                          onChange={(e) => setAppSettings({ ...appSettings, theme: e.target.value })}
                        >
                          <MenuItem value="dark">Dark</MenuItem>
                          <MenuItem value="light">Light</MenuItem>
                          <MenuItem value="auto">Auto</MenuItem>
                        </Select>
                      </FormControl>
                    </ListItemSecondaryAction>
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Language />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Language"
                      secondary="Select your preferred language"
                    />
                    <ListItemSecondaryAction>
                      <FormControl size="small">
                        <Select
                          value={appSettings.language}
                          onChange={(e) => setAppSettings({ ...appSettings, language: e.target.value })}
                        >
                          <MenuItem value="en">English</MenuItem>
                          <MenuItem value="es">Español</MenuItem>
                          <MenuItem value="fr">Français</MenuItem>
                        </Select>
                      </FormControl>
                    </ListItemSecondaryAction>
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <LocationOn />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Units"
                      secondary="Choose measurement units"
                    />
                    <ListItemSecondaryAction>
                      <FormControl size="small">
                        <Select
                          value={appSettings.units}
                          onChange={(e) => setAppSettings({ ...appSettings, units: e.target.value })}
                        >
                          <MenuItem value="imperial">Imperial (lbs, inches)</MenuItem>
                          <MenuItem value="metric">Metric (kg, cm)</MenuItem>
                        </Select>
                      </FormControl>
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Data & Performance
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <Backup />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Auto Backup"
                      secondary="Automatically backup your data"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        edge="end"
                        checked={appSettings.autoBackup}
                        onChange={(e) => setAppSettings({ ...appSettings, autoBackup: e.target.checked })}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <DataUsage />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Analytics"
                      secondary="Help improve the app with usage data"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        edge="end"
                        checked={appSettings.analytics}
                        onChange={(e) => setAppSettings({ ...appSettings, analytics: e.target.checked })}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Data & Privacy Tab */}
      <TabPanel value={tabValue} index={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Privacy & Data Control
                </Typography>
                <Alert severity="info" sx={{ mb: 3 }}>
                  Your data is stored locally on your device and is never shared with third parties without your explicit consent.
                </Alert>
                
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <Lock />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Data Sharing"
                      secondary="Allow sharing of anonymous data for research"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        edge="end"
                        checked={appSettings.dataSharing}
                        onChange={(e) => setAppSettings({ ...appSettings, dataSharing: e.target.checked })}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Security />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Data Encryption"
                      secondary="All data is encrypted locally"
                    />
                    <ListItemSecondaryAction>
                      <Chip label="Enabled" color="success" size="small" />
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>

                <Divider sx={{ my: 3 }} />

                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Data Management
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Button
                    variant="outlined"
                    startIcon={<Backup />}
                    onClick={handleExportData}
                  >
                    Export All Data
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Restore />}
                    component="label"
                  >
                    Import Data
                    <input
                      type="file"
                      accept=".json"
                      hidden
                      onChange={handleImportData}
                    />
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Delete />}
                    color="error"
                    onClick={() => setDeleteDialogOpen(true)}
                  >
                    Delete All Data
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Account Actions
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Button
                    variant="outlined"
                    startIcon={<Person />}
                    fullWidth
                    onClick={() => setTabValue(0)}
                  >
                    Edit Profile
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Notifications />}
                    fullWidth
                    onClick={() => setTabValue(1)}
                  >
                    Notification Settings
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Help />}
                    fullWidth
                  >
                    Help & Support
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Info />}
                    fullWidth
                  >
                    About SciOptimal
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Delete Account Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Account</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Are you sure you want to delete your account? This action cannot be undone and will permanently remove all your data.
          </Typography>
          <Alert severity="warning">
            This will delete all workout history, progress data, and profile information.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteAccount} color="error" variant="contained">
            Delete Account
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Settings;
