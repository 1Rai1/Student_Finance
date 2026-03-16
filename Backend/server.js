const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Initialize Firebase Admin
require('./firebase/firebase-admin');


// Import routes
const userRoutes = require('./src/Users/user-Routes')
const goalRoutes = require('./src/Goals/goal-Routes')
const expenseRoutes = require('./src/Expenses/expense-Routes')

const app = express();

app.use(cors({
  origin: ['http://localhost:8081', 'http://localhost:19006', 'exp://localhost:19000'],
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
    success: true,
    message: 'Student Finance Backend API',
    version: '1.0.0',
    endpoints: {
      students: '/api/students',
      health: '/health'
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