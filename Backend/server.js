const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection - Standard format (NOT using .env to avoid SRV)
const uri = "mongodb://20171107_db_user:1dZyrkDYV5HNCkhQ@ac-a7eeydm-shard-00-00.s8to5wg.mongodb.net:27017,ac-a7eeydm-shard-00-01.s8to5wg.mongodb.net:27017,ac-a7eeydm-shard-00-02.s8to5wg.mongodb.net:27017/student_finance?ssl=true&replicaSet=atlas-ohzk2i-shard-0&authSource=admin&retryWrites=true&w=majority";

const client = new MongoClient(uri);

let db;

async function connectDB() {
  try {
    await client.connect();
    console.log("✅ Connected to MongoDB");
    db = client.db('student_finance');
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
  }
}

connectDB();

// Basic test route
app.get('/', (req, res) => {
  res.json({ message: 'Server is running!' });
});

// Get all students
app.get('/api/students', async (req, res) => {
  try {
    const students = await db.collection('students').find().toArray();
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a student
app.post('/api/students', async (req, res) => {
  try {
    const result = await db.collection('students').insertOne(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});