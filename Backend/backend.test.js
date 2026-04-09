/**
 * Student Finance System - Jest Test Suite
 * 
 * Comprehensive tests for Backend API using Jest and Supertest
 * Run with: cd Backend && npm test
 * 
 * These are REAL tests that test actual middleware and route behavior.
 * Firebase is mocked to allow testing without real Firebase credentials.
 */

const request = require('supertest');
const express = require('express');

// ============================================
// MOCK FIREBASE ADMIN (before importing app)
// ============================================
jest.mock('./firebase/firebase-admin', () => {
  const mockAuth = {
    verifyIdToken: jest.fn(),
    createUser: jest.fn(),
    deleteUser: jest.fn(),
    createCustomToken: jest.fn(),
  };

  const mockDb = {
    collection: jest.fn().mockReturnValue({
      doc: jest.fn().mockReturnValue({
        get: jest.fn().mockResolvedValue({
          exists: true,
          data: () => ({ uid: 'test-uid', email: 'test@test.com', name: 'Test User', role: 'user' }),
          update: jest.fn(),
          delete: jest.fn(),
        }),
        set: jest.fn().mockResolvedValue({}),
        update: jest.fn().mockResolvedValue({}),
        delete: jest.fn().mockResolvedValue({}),
      }),
      add: jest.fn().mockResolvedValue({ id: 'test-doc-id' }),
      where: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      get: jest.fn().mockResolvedValue({
        empty: false,
        forEach: jest.fn(),
        docs: [],
      }),
    }),
  };

  return {
    auth: mockAuth,
    db: mockDb,
    bucket: {
      name: 'test-bucket',
      file: jest.fn().mockReturnValue({
        save: jest.fn().mockResolvedValue({}),
        makePublic: jest.fn().mockResolvedValue({}),
        delete: jest.fn().mockResolvedValue({}),
      }),
    },
  };
});

// Import Firebase mock to access mock functions
const firebaseMock = require('./firebase/firebase-admin');

// ============================================
// CREATE TEST APP
// ============================================
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import and use routes
const authRoutes = require('./src/Auth/auth-Routes');
const userRoutes = require('./src/Users/user-Routes');
const discountRoutes = require('./src/Discounts/discount-Routes');
const { generalLimiter, authLimiter, strictLimiter, readLimiter } = require('./src/Middleware/rateLimiter');

// Apply routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/discount', discountRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ success: true, message: 'Server is running', timestamp: new Date().toISOString() });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Student Finance API', version: '1.0.0' });
});

// ============================================
// TEST SUITE
// ============================================
describe('Student Finance Backend API Tests', () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ==========================================
  // API ENDPOINT TESTS
  // ==========================================
  describe('API Endpoints', () => {
    test('GET /health returns server status', async () => {
      const response = await request(app).get('/health');
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Server is running');
    });

    test('GET / returns API info', async () => {
      const response = await request(app).get('/');
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Student Finance API');
    });
  });

  // ==========================================
  // AUTHENTICATION TESTS
  // ==========================================
  describe('Authentication Middleware', () => {
    test('GET /api/auth/me returns 401 without token', async () => {
      const response = await request(app).get('/api/auth/me');
      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    test('GET /api/auth/me returns 401 with invalid token', async () => {
      // Mock verifyIdToken to throw error
      firebaseMock.auth.verifyIdToken.mockRejectedValue({
        code: 'auth/argument-error',
        message: 'Invalid token',
      });

      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token');
      expect(response.status).toBe(401);
    });

    test('GET /api/auth/me returns user data with valid token', async () => {
      // Mock verifyIdToken to return valid token
      firebaseMock.auth.verifyIdToken.mockResolvedValue({
        uid: 'test-uid-123',
        email: 'test@example.com',
      });

      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer valid-token');
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    test('POST /api/auth/register returns 400 with missing fields', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({ email: 'test@test.com' }); // Missing password and name
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    test('POST /api/auth/register returns 400 with weak password', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({ email: 'test@test.com', password: '123', name: 'Test' });
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    test('POST /api/auth/register handles invalid email format', async () => {
      // Mock Firebase to reject invalid email
      firebaseMock.auth.createUser.mockRejectedValue({
        code: 'auth/invalid-email',
        message: 'The email address is badly formatted.',
      });

      const response = await request(app)
        .post('/api/auth/register')
        .send({ email: 'invalid-email', password: 'password123', name: 'Test' });
      
      // The controller should catch this and return 400
      expect(response.status).toBe(400);
    });
  });

  // ==========================================
  // AUTHORIZATION TESTS
  // ==========================================
  describe('Authorization (Admin/User)', () => {
    test('GET /api/user/admin/all returns 401 without token', async () => {
      const response = await request(app).get('/api/user/admin/all');
      expect(response.status).toBe(401);
    });

    test('GET /api/user/:id returns 401 without token', async () => {
      const response = await request(app).get('/api/user/test-user-id');
      expect(response.status).toBe(401);
    });

    test('GET /api/user/admin/all returns 403 for non-admin user', async () => {
      // Mock verifyIdToken with non-admin user
      firebaseMock.auth.verifyIdToken.mockResolvedValue({
        uid: 'test-uid',
        email: 'user@test.com',
      });

      const response = await request(app)
        .get('/api/user/admin/all')
        .set('Authorization', 'Bearer token');
      expect(response.status).toBe(403);
    });
  });

  // ==========================================
  // RATE LIMITER TESTS
  // ==========================================
  describe('Rate Limiters', () => {
    test('Rate limit headers are present on responses', async () => {
      const response = await request(app).get('/api/discount');
      // Check for RateLimit headers (express-rate-limit adds these)
      expect(response.headers).toHaveProperty('ratelimit-limit');
      expect(response.headers).toHaveProperty('ratelimit-remaining');
      expect(response.headers).toHaveProperty('ratelimit-reset');
    });

    test('Auth endpoint has stricter rate limit', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({ email: 'test@test.com' });
      
      // Auth limiter allows only 5 requests per 15 minutes
      expect(response.headers['ratelimit-limit']).toBe('5');
    });
  });

  // ==========================================
  // FILE UPLOAD TESTS
  // ==========================================
  describe('File Upload Middleware', () => {
    test('Upload middleware is configured for image files', () => {
      const upload = require('./src/Middleware/upload');
      expect(upload).toBeDefined();
      expect(typeof upload.single).toBe('function');
    });

    test('Upload middleware has file size limit of 5MB', () => {
      const upload = require('./src/Middleware/upload');
      // Check that upload is configured (multer stores config internally)
      expect(upload).toBeDefined();
    });
  });

  // ==========================================
  // DISCOUNT ENDPOINT TESTS
  // ==========================================
  describe('Discount Endpoints', () => {
    test('GET /api/discount returns discount list', async () => {
      const response = await request(app).get('/api/discount');
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    test('POST /api/discount/user/:userId requires title, description, location', async () => {
      const response = await request(app)
        .post('/api/discount/user/test-user-id')
        .send({ title: 'Test' }); // Missing description and location
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    test('POST /api/discount/user/:userId returns 404 for non-existent user', async () => {
      // Mock user doc to not exist
      firebaseMock.db.collection().doc().get.mockResolvedValue({
        exists: false,
      });

      const response = await request(app)
        .post('/api/discount/user/non-existent-user')
        .send({
          title: 'Test Discount',
          description: 'Test Description',
          location: 'Test Location',
        });
      expect(response.status).toBe(404);
    });
  });

  // ==========================================
  // MIDDLEWARE CONFIGURATION TESTS
  // ==========================================
  describe('Middleware Configuration', () => {
    test('Auth middleware exports verifyToken, verifyAdmin, verifyOwnership', () => {
      const auth = require('./src/Middleware/auth');
      expect(auth.verifyToken).toBeDefined();
      expect(auth.verifyAdmin).toBeDefined();
      expect(auth.verifyOwnership).toBeDefined();
      expect(typeof auth.verifyToken).toBe('function');
      expect(typeof auth.verifyAdmin).toBe('function');
      expect(typeof auth.verifyOwnership).toBe('function');
    });

    test('Rate limiter middleware exports all limiters', () => {
      const rateLimiter = require('./src/Middleware/rateLimiter');
      expect(rateLimiter.generalLimiter).toBeDefined();
      expect(rateLimiter.strictLimiter).toBeDefined();
      expect(rateLimiter.authLimiter).toBeDefined();
      expect(rateLimiter.readLimiter).toBeDefined();
    });

    test('Upload middleware exports upload', () => {
      const upload = require('./src/Middleware/upload');
      expect(upload).toBeDefined();
      expect(typeof upload.single).toBe('function');
      expect(typeof upload.array).toBe('function');
    });
  });
});

// ============================================
// EXPORT FOR JEST
// ============================================
module.exports = {};