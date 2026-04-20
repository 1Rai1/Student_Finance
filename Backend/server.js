const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Initialize Firebase Admin
require('./firebase/firebase-admin');


// Import routes
const userRoutes = require('./src/Users/user-Routes')
const goalRoutes = require('./src/Goals/goal-Routes')
const expenseRoutes = require('./src/Expenses/expense-Routes')
const discountRoutes = require('./src/Discounts/discount-Routes')
const lessonRoutes = require('./src/Lessons/lesson-Routes')
const authRoutes = require('./src/Auth/auth-Routes')

const app = express();

app.use(cors({
  origin: ['http://localhost:8081', 'http://localhost:19006', 'exp://localhost:19000', 'exp://192.168.0.0/16', 'exp://10.0.0.0/8', 'http://192.168.0.0/16', 'http://10.0.0.0/8'],
  credentials: true
}));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// API Routes
app.use('/api/user', userRoutes)
app.use('/api/goal', goalRoutes)
app.use('/api/expense', expenseRoutes)
app.use('/api/discount', discountRoutes)
app.use('/api/lesson', lessonRoutes)
app.use('/api/auth', authRoutes)

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Student Finance Backend is running',
    timestamp: new Date().toISOString(),
    firebase: 'connected'
  });
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Student Finance API with Firebase Auth',
        endpoints: {
            auth: {
                register: 'POST /api/auth/register',
                me: 'GET /api/auth/me (Protected)',
                delete: 'DELETE /api/auth/delete (Protected)'
            },
            users: {
                admin: 'GET/PUT/DELETE /api/users/admin/* (Admin only)',
                self: 'GET/PUT/DELETE /api/users/:id (Own resources)'
            }
        }
    });
});


// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: err.message
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`
  🚀 Student Finance Backend Started!
  ⏰ Time: ${new Date().toLocaleString()}
  📡 Port: ${PORT}
  🔥 Firebase: Connected
  📍 Health Check: http://localhost:${PORT}/health
  📍 API Base URL: http://localhost:${PORT}/api
  `);
});