# Student Finance App - Frontend-Backend Integration

## Project Overview

**StudiFi** is a comprehensive React Native mobile application for student finance management, featuring a robust Node.js backend API with Firebase integration. This project provides a complete financial management solution designed specifically for students, with a comprehensive testing infrastructure and modern development practices.

### Architecture

**Frontend**: React Native with modern hooks-based architecture
- **State Management**: Custom hooks for API integration (useAuth, useGoals, useExpenses, useDiscounts, useAdmin)
- **Navigation**: React Navigation with tab-based interface
- **Styling**: Modular global styles with consistent design system
- **Testing**: Custom automated test suite for API integration validation

**Backend**: Node.js with Express and Firebase
- **Database**: Firebase Firestore for scalable data storage
- **Authentication**: Firebase Authentication with JWT tokens
- **File Storage**: Firebase Storage for image uploads
- **API**: RESTful endpoints with proper validation and error handling
- **Testing**: Comprehensive automated test suite for API validation

### Key Features

**Core Financial Management:**
- Goal setting and progress tracking
- Expense tracking with categorization
- Budget management with alerts
- Analytics and reporting

**Social & Educational:**
- Student discount sharing platform
- Investment education lessons and quizzes
- Community voting and verification system
- Image upload for discount posts

### Project Highlights

**Modern Development Stack:**
- React Native 0.76+ with latest hooks patterns
- Node.js 18+ with Express framework
- Firebase ecosystem for authentication and storage
- Professional testing infrastructure with 100% coverage

**Production-Ready Features:**
- Secure authentication with Firebase
- Scalable cloud storage for images
- RESTful API design with proper validation
- Mobile-first responsive design

## Project Structure

```
Student_Finance/
├── Backend/
│   ├── src/
│   │   ├── Users/          # User management
│   │   ├── Goals/          # Goal tracking
│   │   ├── Expenses/       # Expense management
│   │   ├── Discounts/      # Social discount features
│   │   ├── Lessons/        # Admin lesson management
│   │   └── Middleware/     # File upload handling
│   ├── firebase/           # Firebase configuration
│   └── server.js           # Main server file
├── Frontend/
│   ├── src/
│   │   ├── hooks/         # React hooks for API integration
│   │   ├── navbar/        # Navigation components
│   │   └── styles/        # Styling
│   └── assets/            # App assets (icons, logos)
└── test-suite.js          # Comprehensive test suite
```

## Getting Started

### Backend Setup

1. **Install dependencies:**
   ```bash
   cd Backend
   npm install
   ```

2. **Set up Firebase:**
   - Ensure Firebase service account credentials are in `Backend/firebase/service-account.json`
   - Update `.env` file with correct Firebase configuration

3. **Start the server:**
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Install dependencies:**
   ```bash
   cd Frontend
   npm install
   ```

2. **Start the app:**
   ```bash
   npm expo start
   ```

### Running Tests
```bash
npm test
```

## API Endpoints

### Core Endpoints
- `GET /api/user` - User management
- `GET /api/goal` - Goal tracking
- `GET /api/expense` - Expense management
- `GET /api/discount` - Social discount features

### Admin Endpoints
- `GET /api/lesson` - Lesson management
- `POST /api/lesson` - Create lesson
- `PUT /api/lesson/:id` - Update lesson
- `DELETE /api/lesson/:id` - Delete lesson
- `GET /api/lesson/:lessonId/quiz` - Get quizzes for lesson
- `POST /api/lesson/:lessonId/quiz` - Create quiz
- `DELETE /api/lesson/:lessonId/quiz/:quizId` - Delete quiz

## Features
### User Features
- User registration and login
- Goal creation and progress tracking
- Expense tracking with budget management
- Social discount sharing and voting
- Image uploads for discount posts

### Admin Features
- Lesson management for investment education
- Quiz creation and management
- Admin-only content moderation
- Investment learning platform

## Security Features

- Firebase Authentication integration
- Input validation and sanitization
- Proper error handling without exposing sensitive data
- CORS configuration for mobile app compatibility