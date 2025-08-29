# SciOptimal Backend Setup Guide

## Overview
This guide will help you set up the backend database and API for the SciOptimal Fitness App. The backend provides:
- **Centralized data storage** for all users
- **Real-time data access** from any device
- **User authentication** and secure data access
- **Admin monitoring** for tracking Devin's progress

## Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- Git

## Quick Start

### 1. Install Backend Dependencies
```bash
cd backend
npm install
```

### 2. Set Up Environment Variables
Create a `.env` file in the `backend` folder:
```bash
cp env.example .env
```

Edit `.env` with your configuration:
```env
# MongoDB Connection (choose one)
MONGODB_URI=mongodb://localhost:27017/scioptimal
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/scioptimal

# JWT Secret (change this in production!)
JWT_SECRET=your-super-secret-jwt-key-change-this

# Server Port
PORT=5000

# Environment
NODE_ENV=development
```

### 3. Start MongoDB
**Local MongoDB:**
```bash
# On macOS with Homebrew
brew services start mongodb-community

# On Ubuntu/Debian
sudo systemctl start mongod

# On Windows
net start MongoDB
```

**MongoDB Atlas (Cloud):**
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Get your connection string
4. Update `MONGODB_URI` in `.env`

### 4. Start the Backend Server
```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### User Management
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile

### Data Management
- `GET /api/workouts` - Get all workouts
- `POST /api/workouts` - Create workout
- `GET /api/nutrition` - Get nutrition entries
- `POST /api/nutrition` - Create nutrition entry
- `GET /api/sleep` - Get sleep entries
- `POST /api/sleep` - Create sleep entry
- `GET /api/progress` - Get progress entries
- `POST /api/progress` - Create progress entry
- `GET /api/training-phases` - Get training phases
- `POST /api/training-phases` - Create training phase

### Admin (for monitoring Devin)
- `GET /api/admin/users` - Get all users
- `GET /api/admin/user/:userId/data` - Get specific user's data

### Health Check
- `GET /api/health` - Server health status

## Frontend Integration

### 1. Update Frontend Environment
Create `.env.local` in the frontend root:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 2. Replace Local Storage with API Calls
The frontend now uses the `apiService.ts` instead of localStorage:
- All data is saved to the database
- Data persists across devices
- Real-time access from anywhere

### 3. Authentication Flow
1. User registers/logs in
2. JWT token is stored in localStorage
3. All API calls include the token
4. Data is associated with the authenticated user

## Database Schema

### Users
- Basic info (name, email, password)
- Profile data (age, height, weight, goals)
- Equipment and preferences

### Workouts
- Exercise details and sets/reps
- RPE and duration
- Muscle group targeting

### Nutrition
- Meal tracking with macros
- Calorie and nutrient totals
- Food item details

### Sleep
- Sleep duration and quality
- Stress and caffeine tracking
- Sleep notes

### Progress
- Weight and body composition
- Strength lift progress
- Body measurements

### Training Phases
- Program structure and progression
- Exercise selection and scheduling
- Nutrition and cardio plans

## Monitoring Devin's Progress

### Admin Access
1. Start the backend server
2. Use the admin endpoints to view all users
3. Find Devin's user ID
4. Access his complete data via `/api/admin/user/:userId/data`

### Data Export
The admin API provides comprehensive data for:
- Workout history and progress
- Nutrition adherence
- Sleep patterns
- Body composition changes
- Training phase completion

## Production Deployment

### 1. Environment Variables
- Use strong JWT secrets
- Secure MongoDB connection strings
- Set `NODE_ENV=production`

### 2. Security
- Enable HTTPS
- Add rate limiting
- Implement proper admin authentication
- Use environment-specific secrets

### 3. Scaling
- Use MongoDB Atlas for cloud hosting
- Implement caching (Redis)
- Add load balancing for multiple instances

## Troubleshooting

### Common Issues

**MongoDB Connection Failed:**
- Check if MongoDB is running
- Verify connection string in `.env`
- Check network/firewall settings

**JWT Token Errors:**
- Verify JWT_SECRET is set
- Check token expiration
- Ensure proper Authorization header format

**CORS Issues:**
- Backend includes CORS middleware
- Check frontend URL in CORS configuration
- Verify API endpoint URLs

**Port Already in Use:**
- Change PORT in `.env`
- Kill existing process: `lsof -ti:5000 | xargs kill`

### Debug Mode
Enable debug logging:
```bash
DEBUG=* npm run dev
```

## Support

For issues or questions:
1. Check the console logs
2. Verify environment variables
3. Test API endpoints with Postman/curl
4. Check MongoDB connection status

## Next Steps

1. **Test the API** with Postman or similar tool
2. **Update frontend** to use the new API service
3. **Deploy backend** to a cloud service
4. **Set up monitoring** for production use
5. **Create admin dashboard** for Devin's progress tracking
