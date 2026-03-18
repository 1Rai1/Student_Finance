const express = require('express')
const router = express.Router()
const lessonController = require('./lesson-Controller')

//get all lessons
router.get('/', lessonController.getAllLessons)
//get lesson by id
router.get('/:lessonId', lessonController.getLessonById)
//create lesson
router.post('/', lessonController.createLesson)
//update lesson
router.put('/:lessonId', lessonController.updateLesson)
//delete lesson and its quizzes
router.delete('/:lessonId', lessonController.deleteLesson)

//get quizzes for a lesson
router.get('/:lessonId/quiz', lessonController.getQuizzesByLesson)
//create quiz question for a lesson
router.post('/:lessonId/quiz', lessonController.createQuiz)
//delete quiz question
router.delete('/:lessonId/quiz/:quizId', lessonController.deleteQuiz)

module.exports = router