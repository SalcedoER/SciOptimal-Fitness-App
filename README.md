# Phase Fitness - Scientific Training & Nutrition App

A comprehensive, phase-based fitness application built with React and TypeScript, featuring scientifically-backed training programs, nutrition tracking, and progress monitoring. Designed for users seeking lean recomposition, strength gains, and physique enhancement.

## 🎯 Core Features

### 1. **Scientific Training Programming**
- **3-Phase System**: Lean Recomp → Muscle Gain → Final Cut
- **RPE-Based Progression**: Rate of Perceived Exertion tracking
- **Equipment-Specific Workouts**: Adapts to available gym equipment
- **Forearm Training Integration**: 2-3x/week specialized training
- **Cardio Optimization**: Post-workout timing for strength preservation

### 2. **Personalized Nutrition System**
- **Macro Calculations**: Based on Mifflin-St Jeor BMR formula
- **Phase-Specific Targets**: Adjusts calories and macros per training phase
- **Debloat Mode**: Low-sodium, anti-bloating nutrition tracking
- **Meal Timing**: Pre/post workout nutrition optimization
- **Hydration Tracking**: Personalized water intake recommendations

### 3. **Advanced Progress Tracking**
- **Body Measurements**: Comprehensive tracking of all key metrics
- **Strength Progress**: Bench, squat, deadlift progression
- **Visual Analytics**: Charts and trends for all progress data
- **Sleep Integration**: Recovery and performance optimization

### 4. **Smart Features**
- **Physique Goal Customization**: Enter any aesthetic goal (e.g., "NFL fullback")
- **Caffeine Timing Logic**: Based on sleep schedule optimization
- **Equipment Adaptation**: Workouts adjust to available equipment
- **Real-time Updates**: Live progress and compliance tracking

## 🧬 Scientific Foundation

### Training Principles
- **Hypertrophy Guidelines**: Based on muscle group frequency and volume research
- **Progression Rules**: RPE-based advancement with automatic weight increases
- **Rest Periods**: Optimized for ATP and creatine phosphate resynthesis
- **Exercise Selection**: Compound movements prioritized with isolation accessories

### Nutrition Science
- **BMR Calculation**: Mifflin-St Jeor formula for accurate metabolic rate
- **Protein Requirements**: 2.2-2.4g/kg for muscle preservation and growth
- **Macro Ratios**: Phase-specific carbohydrate and fat distributions
- **Recovery Nutrition**: 20-40g protein every 3-4 hours for MPS optimization

### Recovery Optimization
- **Sleep Tracking**: 7-9 hours for optimal muscle protein synthesis
- **Cardio Timing**: Post-workout to preserve strength and enhance fat loss
- **Hydration**: 33ml/kg base + activity multiplier
- **Caffeine Management**: 8-hour cutoff before bedtime

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Modern web browser

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd phase-fitness-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Build for Production
```bash
npm run build
```

## 📱 App Structure

### Core Components
```
src/
├── components/
│   ├── Dashboard/          # Main dashboard with overview
│   ├── UserProfile/        # Profile setup and management
│   ├── Workout/           # Workout tracking and execution
│   ├── Nutrition/         # Nutrition logging and tracking
│   ├── Progress/          # Progress tracking and analytics
│   ├── Training/          # Training plan visualization
│   └── Settings/          # App configuration
├── store/                 # Zustand state management
├── utils/                 # Scientific calculations
├── data/                  # Exercise database
└── types/                 # TypeScript definitions
```

### Key Technologies
- **React 18** with TypeScript
- **Material-UI** for modern UI components
- **Zustand** for state management
- **React Hook Form** with Yup validation
- **Recharts** for data visualization
- **React Router** for navigation
- **React Query** for data fetching

## 🎯 Training Phases

### Phase 1: Lean Recomp (8 weeks)
- **Target**: 186 lbs at 14% body fat
- **Calories**: TDEE - 250 (small deficit)
- **Training**: 6 days/week with forearm focus
- **Cardio**: 30 min post-workout, 5x/week

### Phase 2: Muscle Gain (6-10 weeks)
- **Target**: 190 lbs with controlled fat gain
- **Calories**: TDEE + 250 (small surplus)
- **Training**: 5 days/week, higher volume
- **Cardio**: 20 min post-workout, 3x/week

### Phase 3: Final Cut (6 weeks)
- **Target**: 186 lbs at 12% body fat
- **Calories**: TDEE - 600 (larger deficit)
- **Training**: 5 days/week, maintained intensity
- **Cardio**: 45 min post-workout, 6x/week

## 🏋️ Training Splits

### Phase 1 Example
- **Day 1**: Chest + Abs + Forearms
- **Day 2**: Back + Abs + Forearms  
- **Day 3**: Shoulders + Abs
- **Day 4**: Arms + Abs + Optional Forearms
- **Day 5**: Legs + Core
- **Day 6**: Back/Shoulders (rotating)
- **Day 7**: Rest/Active Recovery

### Equipment Integration
- **Dumbbells**: Isolation and unilateral movements
- **Barbells**: Compound strength movements
- **Machines**: Controlled isolation work
- **Cables**: Constant tension movements
- **Smith Machine**: Controlled compound movements

## 🥗 Nutrition System

### Sample Day (Lean Recomp)
```
Breakfast: Banana + French Toast bagel
Lunch: CoreLife bowl (double chicken, purple rice)
Snack: Greek yogurt + berries
Dinner: Grilled chicken breast + pineapple
Post-workout: Protein shake

Macros: ~2,185 kcal, 197g protein, 192g carbs, 55.5g fat
```

### Debloat Mode Features
- **Low Sodium**: <2,000mg daily
- **High Protein**: 2.2g/kg bodyweight
- **Anti-inflammatory**: Focus on whole foods
- **Hydration**: 1+ gallon water daily

## 📊 Progress Tracking

### Body Measurements
- Weight, body fat percentage
- Chest, waist, arms, shoulders
- Thighs, calves, forearms
- Progress photos (future feature)

### Strength Tracking
- Bench press, squat, deadlift
- Overhead press, rows
- Progressive overload monitoring
- RPE-based intensity tracking

### Analytics
- Weight trends over time
- Body composition changes
- Strength progression charts
- Macro compliance tracking

## 🔮 Future Features

### Apple Watch Integration
- Sleep tracking via HealthKit
- Heart rate monitoring
- Active energy tracking
- Workout session sync

### Advanced Analytics
- Machine learning progress predictions
- Personalized recommendations
- Social features and challenges
- Expert consultation integration

### Mobile App
- React Native conversion
- Offline functionality
- Push notifications
- Camera integration for progress photos

## 🧪 Scientific References

### Training Research
- Schoenfeld, B.J. (2010). The mechanisms of muscle hypertrophy and their application to resistance training.
- Morton, R.W. (2018). A systematic review, meta-analysis and meta-regression of the effect of protein supplementation on resistance training-induced gains in muscle mass and strength.

### Nutrition Research
- Mifflin, M.D. (1990). A new predictive equation for resting energy expenditure in healthy individuals.
- Phillips, S.M. (2016). The impact of protein quality on the promotion of resistance exercise-induced changes in body mass and muscle mass.

### Recovery Research
- Dattilo, M. (2011). Sleep and muscle recovery: endocrinological and molecular basis for a new and promising hypothesis.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Scientific research community for evidence-based fitness principles
- Material-UI team for the excellent component library
- React community for the amazing ecosystem
- All beta testers and feedback contributors

---

**Built with ❤️ for the fitness community**

*Phase Fitness - Where Science Meets Strength*
