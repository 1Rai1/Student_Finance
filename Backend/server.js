require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db'); 
//routes
const userRoutes = require('./src/Users/userRoutes');
const goalRoutes = require('./src/Goals/goalRoutes')

console.log('📍 Current directory:', __dirname);
console.log('🔍 MONGO_URI:', process.env.MONGO_URI);
console.log('🔍 PORT:', process.env.PORT);
console.log('🔍 All env vars:', Object.keys(process.env).filter(k => k.includes('MONGO')));


const app = express();

connectDB();

// Middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send("Test");
});

app.use('/users', userRoutes);
app.use('./goals', goalRoutes)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});