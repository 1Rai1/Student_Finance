const {db} = require('../../firebase/firebase-admin')

//db for lessons
const lessonCollection = db.collection('lessons')
//db for quizzes
const quizCollection = db.collection('quizzes')

//get all lessons
const getAllLessons = async (req, res) => {
    try {
        const snapshot = await lessonCollection.get()

        if (snapshot.empty) {
            return res.status(404).json({
                success: false,
                message: "No Lessons Found"
            })
        }

        const lessons = []
        snapshot.forEach(doc => {
            lessons.push({
                id: doc.id,
                ...doc.data()
            })
        })

        res.status(200).json({
            success: true,
            count: lessons.length,
            data: lessons
        })
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error Fetching Lessons",
            error: error.message
        })
    }
}

//get lesson by id
const getLessonById = async (req, res) => {
    try {
        const { lessonId } = req.params

        const lessonDoc = await lessonCollection.doc(lessonId).get()
        if (!lessonDoc.exists) {
            return res.status(404).json({
                success: false,
                message: "Lesson Not Found"
            })
        }

        res.status(200).json({
            success: true,
            data: {
                id: lessonDoc.id,
                ...lessonDoc.data()
            }
        })
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error Fetching Lesson",
            error: error.message
        })
    }
}

//create lesson (admin only)
const createLesson = async (req, res) => {
    try {
        const { title, description, url, duration, category } = req.body

        if (!title || !url || !duration) {
            return res.status(400).json({
                success: false,
                message: "Title, URL and Duration are required"
            })
        }

        const lessonData = {
            title,
            description: description || '',
            url,
            duration,
            category: category || 'Beginner',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }

        const docRef = await lessonCollection.add(lessonData)

        res.status(201).json({
            success: true,
            message: "Lesson Created Successfully",
            data: {
                id: docRef.id,
                ...lessonData
            }
        })
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error Creating Lesson",
            error: error.message
        })
    }
}

//update lesson (admin only)
const updateLesson = async (req, res) => {
    try {
        const { lessonId } = req.params
        const { title, description, url, duration, category } = req.body

        const lessonDoc = await lessonCollection.doc(lessonId).get()
        if (!lessonDoc.exists) {
            return res.status(404).json({
                success: false,
                message: "Lesson Not Found"
            })
        }

        const updateData = {
            ...(title && { title }),
            ...(description !== undefined && { description }),
            ...(url && { url }),
            ...(duration && { duration }),
            ...(category && { category }),
            updatedAt: new Date().toISOString()
        }

        await lessonCollection.doc(lessonId).update(updateData)

        const updatedDoc = await lessonCollection.doc(lessonId).get()

        res.status(200).json({
            success: true,
            message: "Lesson Updated Successfully",
            data: {
                id: updatedDoc.id,
                ...updatedDoc.data()
            }
        })
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error Updating Lesson",
            error: error.message
        })
    }
}

//delete lesson and its quizzes (admin only)
const deleteLesson = async (req, res) => {
    try {
        const { lessonId } = req.params

        const lessonDoc = await lessonCollection.doc(lessonId).get()
        if (!lessonDoc.exists) {
            return res.status(404).json({
                success: false,
                message: "Lesson Not Found"
            })
        }

        //delete all quizzes belonging to this lesson
        const quizSnapshot = await quizCollection
            .where('lessonId', '==', lessonId)
            .get()

        const deleteQuizzes = []
        quizSnapshot.forEach(doc => {
            deleteQuizzes.push(quizCollection.doc(doc.id).delete())
        })
        await Promise.all(deleteQuizzes)

        //delete the lesson itself
        await lessonCollection.doc(lessonId).delete()

        res.status(200).json({
            success: true,
            message: "Lesson and its Quizzes Deleted Successfully"
        })
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error Deleting Lesson",
            error: error.message
        })
    }
}

//get all quizzes for a lesson
const getQuizzesByLesson = async (req, res) => {
    try {
        const { lessonId } = req.params

        //check lesson exists
        const lessonDoc = await lessonCollection.doc(lessonId).get()
        if (!lessonDoc.exists) {
            return res.status(404).json({
                success: false,
                message: "Lesson Not Found"
            })
        }

        const snapshot = await quizCollection
            .where('lessonId', '==', lessonId)
            .get()

        if (snapshot.empty) {
            return res.status(404).json({
                success: false,
                message: "No Quizzes Found For This Lesson"
            })
        }

        const quizzes = []
        snapshot.forEach(doc => {
            quizzes.push({
                id: doc.id,
                ...doc.data()
            })
        })

        res.status(200).json({
            success: true,
            count: quizzes.length,
            data: quizzes
        })
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error Fetching Quizzes",
            error: error.message
        })
    }
}

//create quiz question for a lesson (admin only)
const createQuiz = async (req, res) => {
    try {
        const { lessonId } = req.params
        const { question, options, correctIndex } = req.body

        if (!question || !options || options.length < 2) {
            return res.status(400).json({
                success: false,
                message: "Question and at least 2 options are required"
            })
        }

        if (correctIndex === undefined || correctIndex < 0 || correctIndex >= options.length) {
            return res.status(400).json({
                success: false,
                message: "Valid correctIndex is required"
            })
        }

        //check lesson exists
        const lessonDoc = await lessonCollection.doc(lessonId).get()
        if (!lessonDoc.exists) {
            return res.status(404).json({
                success: false,
                message: "Lesson Not Found"
            })
        }

        const quizData = {
            lessonId,
            question,
            options,
            correctIndex: parseInt(correctIndex),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }

        const docRef = await quizCollection.add(quizData)

        res.status(201).json({
            success: true,
            message: "Quiz Question Created Successfully",
            data: {
                id: docRef.id,
                ...quizData
            }
        })
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error Creating Quiz",
            error: error.message
        })
    }
}

//delete a quiz question (admin only)
const deleteQuiz = async (req, res) => {
    try {
        const { quizId } = req.params

        const quizDoc = await quizCollection.doc(quizId).get()
        if (!quizDoc.exists) {
            return res.status(404).json({
                success: false,
                message: "Quiz Not Found"
            })
        }

        await quizCollection.doc(quizId).delete()

        res.status(200).json({
            success: true,
            message: "Quiz Question Deleted Successfully"
        })
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error Deleting Quiz",
            error: error.message
        })
    }
}

module.exports = {
    getAllLessons,
    getLessonById,
    createLesson,
    updateLesson,
    deleteLesson,
    getQuizzesByLesson,
    createQuiz,
    deleteQuiz
}