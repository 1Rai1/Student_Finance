const express = require('express');
const cors = require('cors');
require('dotenv').config();

//initialize Firebase Admin
require('./firebase/firebase-admin');

//import routes
const userRoutes = require('./src/Users/user-Routes')
const goalRoutes = require('./src/Goals/goal-Routes')
const expenseRoutes = require('./src/Expenses/expense-Routes')
const discountRoutes = require('./src/Discounts/discount-Routes')
const lessonRoutes = require('./src/Lessons/lesson-Routes')

const app = express();

app.use(cors({
  origin: ['http://localhost:8081', 'http://localhost:19006', 'exp://localhost:19000'],
  credentials: true
}));

//body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

//API routes
app.use('/api/user', userRoutes)
app.use('/api/goal', goalRoutes)
app.use('/api/expense', expenseRoutes)
app.use('/api/discount', discountRoutes)
app.use('/api/lesson', lessonRoutes)

//health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Student Finance Backend is running',
    timestamp: new Date().toISOString(),
    firebase: 'connected'
  });
});

//root
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

//error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: err.message
  });
});

//start server
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