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
jest.mock('./src/Middleware/cloudinary', () => ({
  uploader: {
    upload: jest.fn().mockResolvedValue({
      secure_url: 'https://res.cloudinary.com/test-cloud/image/upload/test-image.jpg',
      public_id: 'student-finance/test-image-123'
    }),
    destroy: jest.fn().mockResolvedValue({ result: 'ok' })
  },
  config: jest.fn()
}));

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
    const upload = require('./src/Middleware/upload');
    const path = require('path');
    const fs = require('fs');

    // Setup test route that uses upload middleware
    beforeAll(() => {
      app.post('/api/test-upload', upload.single('image'), (req, res) => {
        if (req.file) {
          res.status(200).json({
            success: true,
            filename: req.file.originalname,
            size: req.file.size,
            mimetype: req.file.mimetype
          });
        } else {
          res.status(400).json({ success: false, message: 'No file uploaded' });
        }
      });
    });

    test('Middleware correctly accepts valid image files', async () => {
      // Create a small valid test image buffer (1x1 png)
      const testPng = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64');
      
      const response = await request(app)
        .post('/api/test-upload')
        .attach('image', testPng, 'test-image.png');
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.filename).toBe('test-image.png');
    });

    test('Middleware rejects non-image file types', async () => {
      // Try uploading a text file
      const response = await request(app)
        .post('/api/test-upload')
        .attach('image', Buffer.from('this is not an image'), 'document.txt');
      
      // Should reject with error
      expect(response.status).toBe(500);
      expect(response.text).toContain('Only Images can be uploaded');
    });

    test('Middleware enforces 5MB file size limit', async () => {
      // Create 6MB dummy file
      const largeFile = Buffer.alloc(6 * 1024 * 1024);
      
      const response = await request(app)
        .post('/api/test-upload')
        .attach('image', largeFile, 'too-big.png');
      
      // Should reject with file too large
      expect(response.status).toBe(500);
      expect(response.text).toContain('File too large');
    });

    test('Discount endpoint correctly handles image upload and processing', async () => {
      // Send a valid discount post WITH an image
      const testImage = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64');

      firebaseMock.auth.verifyIdToken.mockResolvedValue({ uid: 'test-uid' });

      const cloudinary = require('./src/Middleware/cloudinary');
      
      // Mock to return properly when upload_stream is called
      const mockUploadStream = jest.fn((options, callback) => {
        callback(null, {
          secure_url: 'https://res.cloudinary.com/test-cloud/image/upload/test-image.jpg',
          public_id: 'student-finance/test-image-123'
        });
        return { end: jest.fn() };
      });
      
      cloudinary.uploader.upload_stream = mockUploadStream;

      const response = await request(app)
        .post('/api/discount/user/test-uid')
        .set('Authorization', 'Bearer valid-test-token')
        .field('title', 'Test Discount with Image')
        .field('description', 'This discount has an attached image')
        .field('location', 'Test Location')
        .attach('image', testImage, 'discount-image.jpg');

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      
      // Verify Cloudinary was called
      expect(mockUploadStream).toHaveBeenCalled();
      
      // Verify image URL is returned
      expect(response.body.data.imageUrl).toBeDefined();
      expect(response.body.data.imageUrl).toContain('https://res.cloudinary.com/');
    });

    test('Discount endpoint works correctly without image upload', async () => {
      firebaseMock.auth.verifyIdToken.mockResolvedValue({ uid: 'test-uid' });

      const response = await request(app)
        .post('/api/discount/user/test-uid')
        .set('Authorization', 'Bearer valid-test-token')
        .send({
          title: 'Test Discount No Image',
          description: 'This discount has no image',
          location: 'Test Location'
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.imageUrl).toBe('');
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
        .set('Authorization', 'Bearer valid-test-token')
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
        .set('Authorization', 'Bearer valid-test-token')
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