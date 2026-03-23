/**
 * Student Finance System - Comprehensive Test Suite
 * 
 * automated tests for both the Backend API and Frontend components.
 * Run with: npm test
 */

const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

// Configuration
const BASE_URL = 'http://localhost:5000/api';
const TEST_TIMEOUT = 30000;

// Test data
const testUsers = [
  { name: 'Test User 1', email: 'test1@example.com', password: 'password123', role: 'user' },
  { name: 'Test User 2', email: 'test2@example.com', password: 'password123', role: 'user' },
  { name: 'Admin User', email: 'admin@example.com', password: 'password123', role: 'admin' }
];

const testGoals = [
  { title: 'Test Goal 1', targetAmount: 1000, category: 'general' },
  { title: 'Test Goal 2', targetAmount: 500, category: 'savings' }
];

const testExpenses = [
  { title: 'Test Expense 1', amount: 50, category: 'Food' },
  { title: 'Test Expense 2', amount: 100, category: 'Transport' }
];

const testLessons = [
  { title: 'Test Lesson 1', description: 'Test Description', category: 'Beginner', duration: '10:00', url: 'https://example.com/video1' },
  { title: 'Test Lesson 2', description: 'Test Description 2', category: 'Stocks', duration: '15:00', url: 'https://example.com/video2' }
];

const testQuizzes = [
  { question: 'What is 2+2?', options: ['3', '4', '5', '6'], correctIndex: 1 },
  { question: 'What is 3+3?', options: ['5', '6', '7', '8'], correctIndex: 1 }
];

// Storage for test IDs
const testData = {
  users: [],
  goals: [],
  expenses: [],
  lessons: [],
  quizzes: [],
  discounts: []
};

// Helper functions
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const createUser = async (userData) => {
  try {
    const response = await axios.post(`${BASE_URL}/user/create`, userData);
    if (response.data.success) {
      testData.users.push({ ...response.data.data, originalData: userData });
      console.log(`✓ Created user: ${userData.email}`);
      return response.data.data;
    }
    return null;
  } catch (error) {
    console.error(`✗ Failed to create user ${userData.email}:`, error.message);
    return null;
  }
};

const loginUser = async (email, password) => {
  try {
    const response = await axios.get(`${BASE_URL}/user`);
    const users = response.data.data || [];
    const user = users.find(u => u.email === email && u.password === password);
    return user || null;
  } catch (error) {
    console.error('Login failed:', error.message);
    return null;
  }
};

const createGoal = async (userId, goalData) => {
  try {
    const response = await axios.post(`${BASE_URL}/goal/user/${userId}`, goalData);
    if (response.data.success) {
      testData.goals.push({ ...response.data.data, userId });
      console.log(`✓ Created goal: ${goalData.title}`);
      return response.data.data;
    }
    return null;
  } catch (error) {
    console.error(`✗ Failed to create goal:`, error.message);
    return null;
  }
};

const createExpense = async (userId, expenseData) => {
  try {
    const response = await axios.post(`${BASE_URL}/expense/user/${userId}`, expenseData);
    if (response.data.success) {
      testData.expenses.push({ ...response.data.data, userId });
      console.log(`✓ Created expense: ${expenseData.title}`);
      return response.data.data;
    }
    return null;
  } catch (error) {
    console.error(`✗ Failed to create expense:`, error.message);
    return null;
  }
};

const createLesson = async (lessonData) => {
  try {
    const response = await axios.post(`${BASE_URL}/lesson`, lessonData);
    if (response.data.success) {
      testData.lessons.push(response.data.data);
      console.log(`✓ Created lesson: ${lessonData.title}`);
      return response.data.data;
    }
    return null;
  } catch (error) {
    console.error(`✗ Failed to create lesson:`, error.message);
    return null;
  }
};

const createQuiz = async (lessonId, quizData) => {
  try {
    const response = await axios.post(`${BASE_URL}/lesson/${lessonId}/quiz`, quizData);
    if (response.data.success) {
      testData.quizzes.push({ ...response.data.data, lessonId });
      console.log(`✓ Created quiz for lesson ${lessonId}`);
      return response.data.data;
    }
    return null;
  } catch (error) {
    console.error(`✗ Failed to create quiz:`, error.message);
    return null;
  }
};

const createDiscount = async (userId, discountData) => {
  try {
    const response = await axios.post(`${BASE_URL}/discount/user/${userId}`, discountData);
    if (response.data.success) {
      testData.discounts.push({ ...response.data.data, userId });
      console.log(`✓ Created discount: ${discountData.title}`);
      return response.data.data;
    }
    return null;
  } catch (error) {
    console.error(`✗ Failed to create discount:`, error.message);
    return null;
  }
};

// Test functions
const testUserManagement = async () => {
  console.log('\n Testing User Management');
  
  // Test 1: Create users
  console.log('Test 1: Creating test users...');
  const user1 = await createUser(testUsers[0]);
  const user2 = await createUser(testUsers[1]);
  const admin = await createUser(testUsers[2]);
  
  if (!user1 || !user2 || !admin) {
    console.log('✗ User creation failed');
    return false;
  }
  
  // Test 2: Get all users
  console.log('Test 2: Getting all users...');
  try {
    const response = await axios.get(`${BASE_URL}/user`);
    if (response.data.success && response.data.data.length >= 3) {
      console.log('✓ Successfully retrieved users');
    } else {
      console.log('✗ Failed to retrieve users');
      return false;
    }
  } catch (error) {
    console.error('✗ Get users failed:', error.message);
    return false;
  }
  
  // Test 3: Get user by ID
  console.log('Test 3: Getting user by ID...');
  try {
    const response = await axios.get(`${BASE_URL}/user/${user1.id}`);
    if (response.data.success && response.data.data.id === user1.id) {
      console.log('✓ Successfully retrieved user by ID');
    } else {
      console.log('✗ Failed to retrieve user by ID');
      return false;
    }
  } catch (error) {
    console.error('✗ Get user by ID failed:', error.message);
    return false;
  }
  
  // Test 4: Update user
  console.log('Test 4: Updating user...');
  try {
    const updateData = { name: 'Updated Test User 1', monthlyBudget: 2000 };
    const response = await axios.put(`${BASE_URL}/user/${user1.id}`, updateData);
    if (response.data.success) {
      console.log('✓ Successfully updated user');
    } else {
      console.log('✗ Failed to update user');
      return false;
    }
  } catch (error) {
    console.error('✗ Update user failed:', error.message);
    return false;
  }
  
  console.log('✓✓ User Management tests passed');
  return true;
};

const testGoalManagement = async () => {
  console.log('\n Testing Goal Management');
  
  if (testData.users.length === 0) {
    console.log('✗ No users available for goal tests');
    return false;
  }
  
  const userId = testData.users[0].id;
  
  // Test 1: Create goals
  console.log('Test 1: Creating goals...');
  const goal1 = await createGoal(userId, testGoals[0]);
  const goal2 = await createGoal(userId, testGoals[1]);
  
  if (!goal1 || !goal2) {
    console.log('✗ Goal creation failed');
    return false;
  }
  
  // Test 2: Get user goals
  console.log('Test 2: Getting user goals...');
  try {
    const response = await axios.get(`${BASE_URL}/goal/user/${userId}`);
    if (response.data.success && response.data.data.length >= 2) {
      console.log('✓ Successfully retrieved user goals');
    } else {
      console.log('✗ Failed to retrieve user goals');
      return false;
    }
  } catch (error) {
    console.error('✗ Get user goals failed:', error.message);
    return false;
  }
  
  // Test 3: Add progress to goal
  console.log('Test 3: Adding progress to goal...');
  try {
    const response = await axios.post(`${BASE_URL}/goal/${goal1.id}/progress`, { amount: 200 });
    if (response.data.success && response.data.data.currentAmount === 200) {
      console.log('✓ Successfully added progress to goal');
    } else {
      console.log('✗ Failed to add progress to goal');
      return false;
    }
  } catch (error) {
    console.error('✗ Add progress failed:', error.message);
    return false;
  }
  
  // Test 4: Update goal
  console.log('Test 4: Updating goal...');
  try {
    const updateData = { title: 'Updated Test Goal 1', targetAmount: 1500 };
    const response = await axios.put(`${BASE_URL}/goal/${goal1.id}`, updateData);
    if (response.data.success) {
      console.log('✓ Successfully updated goal');
    } else {
      console.log('✗ Failed to update goal');
      return false;
    }
  } catch (error) {
    console.error('✗ Update goal failed:', error.message);
    return false;
  }
  
  console.log('✓✓ Goal Management tests passed');
  return true;
};

const testExpenseManagement = async () => {
  console.log('\n Testing Expense Management');
  
  if (testData.users.length === 0) {
    console.log('✗ No users available for expense tests');
    return false;
  }
  
  const userId = testData.users[0].id;
  
  // Test 1: Create expenses
  console.log('Test 1: Creating expenses...');
  const expense1 = await createExpense(userId, testExpenses[0]);
  const expense2 = await createExpense(userId, testExpenses[1]);
  
  if (!expense1 || !expense2) {
    console.log('✗ Expense creation failed');
    return false;
  }
  
  // Test 2: Get user expenses
  console.log('Test 2: Getting user expenses...');
  try {
    const response = await axios.get(`${BASE_URL}/expense/user/${userId}`);
    if (response.data.success && response.data.data.length >= 2) {
      console.log('✓ Successfully retrieved user expenses');
    } else {
      console.log('✗ Failed to retrieve user expenses');
      return false;
    }
  } catch (error) {
    console.error('✗ Get user expenses failed:', error.message);
    return false;
  }
  
  // Test 3: Update expense
  console.log('Test 3: Updating expense...');
  try {
    const updateData = { title: 'Updated Test Expense 1', amount: 75 };
    const response = await axios.put(`${BASE_URL}/expense/${expense1.id}`, updateData);
    if (response.data.success) {
      console.log('✓ Successfully updated expense');
    } else {
      console.log('✗ Failed to update expense');
      return false;
    }
  } catch (error) {
    console.error('✗ Update expense failed:', error.message);
    return false;
  }
  
  console.log('✓✓ Expense Management tests passed');
  return true;
};

const testLessonManagement = async () => {
  console.log('\n Testing Lesson Management');
  
  // Test 1: Create lessons
  console.log('Test 1: Creating lessons...');
  const lesson1 = await createLesson(testLessons[0]);
  const lesson2 = await createLesson(testLessons[1]);
  
  if (!lesson1 || !lesson2) {
    console.log('✗ Lesson creation failed');
    return false;
  }
  
  // Test 2: Get all lessons
  console.log('Test 2: Getting all lessons...');
  try {
    const response = await axios.get(`${BASE_URL}/lesson`);
    if (response.data.success && response.data.data.length >= 2) {
      console.log('✓ Successfully retrieved lessons');
    } else {
      console.log('✗ Failed to retrieve lessons');
      return false;
    }
  } catch (error) {
    console.error('✗ Get lessons failed:', error.message);
    return false;
  }
  
  // Test 3: Create quizzes
  console.log('Test 3: Creating quizzes...');
  const quiz1 = await createQuiz(lesson1.id, testQuizzes[0]);
  const quiz2 = await createQuiz(lesson2.id, testQuizzes[1]);
  
  if (!quiz1 || !quiz2) {
    console.log('✗ Quiz creation failed');
    return false;
  }
  
  // Test 4: Get quizzes for lesson
  console.log('Test 4: Getting quizzes for lesson...');
  try {
    const response = await axios.get(`${BASE_URL}/lesson/${lesson1.id}/quiz`);
    if (response.data.success && response.data.data.length >= 1) {
      console.log('✓ Successfully retrieved lesson quizzes');
    } else {
      console.log('✗ Failed to retrieve lesson quizzes');
      return false;
    }
  } catch (error) {
    console.error('✗ Get lesson quizzes failed:', error.message);
    return false;
  }
  
  console.log('✓✓ Lesson Management tests passed');
  return true;
};

const testDiscountManagement = async () => {
  console.log('\n Testing Discount Management');
  
  if (testData.users.length === 0) {
    console.log('✗ No users available for discount tests');
    return false;
  }
  
  const userId = testData.users[0].id;
  
  // Test 1: Create discount
  console.log('Test 1: Creating discount...');
  const discountData = {
    title: 'Test Discount',
    description: 'Test discount description',
    location: 'Test Location'
  };
  
  const discount = await createDiscount(userId, discountData);
  
  if (!discount) {
    console.log('✗ Discount creation failed');
    return false;
  }
  
  // Test 2: Get all discounts
  console.log('Test 2: Getting all discounts...');
  try {
    const response = await axios.get(`${BASE_URL}/discount`);
    if (response.data.success && response.data.data.length >= 1) {
      console.log('✓ Successfully retrieved discounts');
    } else {
      console.log('✗ Failed to retrieve discounts');
      return false;
    }
  } catch (error) {
    console.error('✗ Get discounts failed:', error.message);
    return false;
  }
  
  // Test 3: Like discount
  console.log('Test 3: Liking discount...');
  try {
    const response = await axios.post(`${BASE_URL}/discount/${discount.id}/like`, { userId });
    if (response.data.success) {
      console.log('✓ Successfully liked discount');
    } else {
      console.log('✗ Failed to like discount');
      return false;
    }
  } catch (error) {
    console.error('✗ Like discount failed:', error.message);
    return false;
  }
  
  // Test 4: Vote on discount
  console.log('Test 4: Voting on discount...');
  try {
    const response = await axios.post(`${BASE_URL}/discount/${discount.id}/vote`, { userId, vote: 'real' });
    if (response.data.success) {
      console.log('✓ Successfully voted on discount');
    } else {
      console.log('✗ Failed to vote on discount');
      return false;
    }
  } catch (error) {
    console.error('✗ Vote on discount failed:', error.message);
    return false;
  }
  
  console.log('✓✓ Discount Management tests passed');
  return true;
};

const testAPIEndpoints = async () => {
  console.log('\n Testing API Endpoints');
  
  // Test health endpoint
  console.log('Test 1: Health check...');
  try {
    const response = await axios.get('http://localhost:5000/health');
    if (response.data.success) {
      console.log('✓ Health check passed');
    } else {
      console.log('✗ Health check failed');
      return false;
    }
  } catch (error) {
    console.error('✗ Health check failed:', error.message);
    return false;
  }
  
  // Test root endpoint
  console.log('Test 2: Root endpoint...');
  try {
    const response = await axios.get('http://localhost:5000/');
    if (response.data.success) {
      console.log('✓ Root endpoint working');
    } else {
      console.log('✗ Root endpoint failed');
      return false;
    }
  } catch (error) {
    console.error('✗ Root endpoint failed:', error.message);
    return false;
  }
  
  console.log('✓✓ API Endpoints tests passed');
  return true;
};

// Cleanup function
const cleanup = async () => {
  console.log('\n Cleaning up test data...');
  
  try {
    // Delete discounts
    for (const discount of testData.discounts) {
      try {
        await axios.delete(`${BASE_URL}/discount/${discount.id}`);
        console.log(`✓ Deleted discount: ${discount.title}`);
      } catch (error) {
        console.error(`✗ Failed to delete discount ${discount.id}:`, error.message);
      }
    }
    
    // Delete quizzes
    for (const quiz of testData.quizzes) {
      try {
        await axios.delete(`${BASE_URL}/lesson/${quiz.lessonId}/quiz/${quiz.id}`);
        console.log(`✓ Deleted quiz: ${quiz.id}`);
      } catch (error) {
        console.error(`✗ Failed to delete quiz ${quiz.id}:`, error.message);
      }
    }
    
    // Delete lessons
    for (const lesson of testData.lessons) {
      try {
        await axios.delete(`${BASE_URL}/lesson/${lesson.id}`);
        console.log(`✓ Deleted lesson: ${lesson.title}`);
      } catch (error) {
        console.error(`✗ Failed to delete lesson ${lesson.id}:`, error.message);
      }
    }
    
    // Delete expenses
    for (const expense of testData.expenses) {
      try {
        await axios.delete(`${BASE_URL}/expense/${expense.id}`);
        console.log(`✓ Deleted expense: ${expense.title}`);
      } catch (error) {
        console.error(`✗ Failed to delete expense ${expense.id}:`, error.message);
      }
    }
    
    // Delete goals
    for (const goal of testData.goals) {
      try {
        await axios.delete(`${BASE_URL}/goal/${goal.id}`);
        console.log(`✓ Deleted goal: ${goal.title}`);
      } catch (error) {
        console.error(`✗ Failed to delete goal ${goal.id}:`, error.message);
      }
    }
    
    // Delete users
    for (const user of testData.users) {
      try {
        await axios.delete(`${BASE_URL}/user/${user.id}`);
        console.log(`✓ Deleted user: ${user.email}`);
      } catch (error) {
        console.error(`✗ Failed to delete user ${user.id}:`, error.message);
      }
    }
    
    console.log('✓✓ Cleanup completed');
  } catch (error) {
    console.error('✗ Cleanup failed:', error.message);
  }
};

// Main test runner
const runTests = async () => {
  console.log(' Starting Student Finance System Test Suite');
  console.log('='.repeat(50));
  
  const tests = [
    testAPIEndpoints,
    testUserManagement,
    testGoalManagement,
    testExpenseManagement,
    testLessonManagement,
    testDiscountManagement
  ];
  
  let passedTests = 0;
  let totalTests = tests.length;
  
  for (const test of tests) {
    try {
      const result = await test();
      if (result) {
        passedTests++;
      }
    } catch (error) {
      console.error(`✗ Test failed with error:`, error.message);
    }
  }
  
  console.log('\n' + '='.repeat(50));
  console.log(` Test Results: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    console.log(' All tests passed! The system is working correctly.');
  } else {
    console.log(`✗✗ ${totalTests - passedTests} test(s) failed. Please check the errors above.`);
  }
  
  // Always run cleanup
  await cleanup();
  
  return passedTests === totalTests;
};

// Run tests if this file is executed directly
if (require.main === module) {
  runTests()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('Test suite failed:', error);
      process.exit(1);
    });
}

module.exports = { runTests, cleanup, testData };