const express = require('express')
const router = express.Router()
const lessonController = require('./lesson-Controller')
const {strictLimiter, readLimiter} = require('./../Middleware/rateLimiter')
const {verifyAdmin } = require('../Middleware/auth');

//get All Lessons
router.get('/',readLimiter, lessonController.getAllLessons)
//get Specific lesson
router.get('/:id',readLimiter, lessonController.getLessonById)
//create lesson
router.post('/',strictLimiter,verifyAdmin, lessonController.createLesson)
//update lesson
router.put('/:id',strictLimiter,verifyAdmin, lessonController.updateLesson)
//delete lesson
router.delete('/:id',strictLimiter,verifyAdmin, lessonController.deleteLesson)

//quiz routes for lessons
//get quizzes for a lesson
router.get('/:lessonId/quiz',readLimiter, lessonController.getQuizzesByLessonId)
//create quiz for a lesson
router.post('/:lessonId/quiz',strictLimiter,verifyAdmin, lessonController.createQuiz)
//delete quiz
router.delete('/:lessonId/quiz/:quizId',strictLimiter,verifyAdmin, lessonController.deleteQuiz)

module.exports = router