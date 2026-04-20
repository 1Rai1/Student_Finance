const express = require('express')
const router = express.Router()
const lessonController = require('./lesson-Controller')
const {strictLimiter, readLimiter} = require('./../Middleware/rateLimiter')
const { verifyToken, verifyAdmin } = require('../Middleware/auth');

// Public routes (no auth required for reading)
router.get('/', readLimiter, lessonController.getAllLessons)
router.get('/:id', readLimiter, lessonController.getLessonById)

// Admin-only routes (require authentication AND admin role)
router.post('/', strictLimiter, verifyToken, verifyAdmin, lessonController.createLesson)
router.put('/:id', strictLimiter, verifyToken, verifyAdmin, lessonController.updateLesson)
router.delete('/:id', strictLimiter, verifyToken, verifyAdmin, lessonController.deleteLesson)

// Quiz routes
router.get('/:lessonId/quiz', readLimiter, lessonController.getQuizzesByLessonId)
router.post('/:lessonId/quiz', strictLimiter, verifyToken, verifyAdmin, lessonController.createQuiz)
router.delete('/:lessonId/quiz/:quizId', strictLimiter, verifyToken, verifyAdmin, lessonController.deleteQuiz)

module.exports = router