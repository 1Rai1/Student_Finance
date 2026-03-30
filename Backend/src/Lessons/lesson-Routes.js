const express = require('express')
const router = express.Router()
const lessonController = require('./lesson-Controller')

//get All Lessons
router.get('/', lessonController.getAllLessons)
//get Specific lesson
router.get('/:id', lessonController.getLessonById)
//create lesson
router.post('/', lessonController.createLesson)
//update lesson
router.put('/:id', lessonController.updateLesson)
//delete lesson
router.delete('/:id', lessonController.deleteLesson)

//quiz routes for lessons
//get quizzes for a lesson
router.get('/:lessonId/quiz', lessonController.getQuizzesByLessonId)
//create quiz for a lesson
router.post('/:lessonId/quiz', lessonController.createQuiz)
//delete quiz
router.delete('/:lessonId/quiz/:quizId', lessonController.deleteQuiz)

module.exports = router