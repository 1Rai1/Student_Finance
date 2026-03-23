const {db} = require('../../firebase/firebase-admin')

//reference
const lessonCollection = db.collection('lessons')
const quizCollection = db.collection('quizzes')

//Get all lessons
const getAllLessons = async (req, res) => {
    try{
        const snapshot = await lessonCollection.get()

        if(snapshot.empty){
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
    catch(error){
        return res.status(500).json({
            success: false, 
            message: "Error Fetching Lessons",
            error: error.message
        })
    }
}

//Get Lesson by ID
const getLessonById = async (req, res) => {
    try{
        const {id} = req.params

        const lessonDoc = await lessonCollection.doc(id).get()

        if(!lessonDoc.exists){
            return res.status(404).json({
                success: false,
                message: "Lesson not Found"
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
    catch(error){
        return res.status(500).json({
            success: false,
            message: "Error fetching Lesson",
            error: error.message
        })
    }
}

//Create Lesson
const createLesson = async (req, res) => {
    try{
        const {title, description, category, duration, url} = req.body

        if(!title || !url || !category){
            return res.status(400).json({
                success: false,
                message: "Title, URL, and Category are required"
            })
        }
        
        const lessonData = {
            title,
            description: description || '',
            category,
            duration: duration || '',
            url,
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
    catch(error){
        console.error('Full error:', error);
        res.status(500).json({
            success: false,
            message: "Error Creating Lesson",
            error: error.message
        })
    }
}

//Update Lesson
const updateLesson = async(req, res) => {
    try{
        const {id} = req.params
        const {title, description, category, duration, url} = req.body
        
        //Check if Lesson exist
        const lessonDoc = await lessonCollection.doc(id).get()
        
        //Return if lesson not found
        if(!lessonDoc.exists){
            return res.status(404).json({
                success: false,
                message: "Lesson Not Found"
            })    
        }
        
        //Only update if value is truthy
        const updateData = {
            ...(title && {title}),
            ...(description && {description}),
            ...(category && {category}),
            ...(duration && {duration}),
            ...(url && {url}),
            updatedAt: new Date().toISOString()
        }

        await lessonCollection.doc(id).update(updateData)

        const updatedDoc = await lessonCollection.doc(id).get()

        res.status(200).json({  
            success: true,
            message: "Lesson Updated Successfully",
            data: { 
                id: updatedDoc.id,
                ...updatedDoc.data()
            }
        })
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: "Error Updating Lesson",
            error: error.message
        })
    }
}

//Delete Lesson
const deleteLesson = async(req, res) => {
    try{
        const {id} = req.params

        //check if lesson exist
        const lessonDoc = await lessonCollection.doc(id).get()
        if(!lessonDoc.exists){
            return res.status(404).json({
                success: false,
                message: "Lesson not found"
            })
        }

        //Delete associated quizzes first
        const quizSnapshot = await quizCollection.where('lessonId', '==', id).get()
        quizSnapshot.forEach(async (quizDoc) => {
            await quizDoc.ref.delete()
        })

        await lessonCollection.doc(id).delete()

        res.status(200).json({
            success: true,
            message: "Lesson Deleted Successfully"
        })
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: "Error Deleting Lesson",
            error: error.message
        })
    }
}

//Get quizzes for a lesson
const getQuizzesByLessonId = async (req, res) => {
    try {
        const { lessonId } = req.params
        
        const snapshot = await quizCollection
            .where('lessonId', '==', lessonId)
            .get()

        if (snapshot.empty) {
            return res.status(404).json({
                success: false,
                message: 'No quizzes found for this lesson'
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
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching quizzes',
            error: error.message
        })
    }
}

//Create quiz for a lesson
const createQuiz = async (req, res) => {
    try {
        const { lessonId } = req.params
        const { question, options, correctIndex } = req.body

        if (!question || !options || correctIndex === undefined) {
            return res.status(400).json({
                success: false,
                message: 'Question, options, and correctIndex are required'
            })
        }

        // Validate options array
        if (!Array.isArray(options) || options.length < 2) {
            return res.status(400).json({
                success: false,
                message: 'Options must be an array with at least 2 items'
            })
        }

        // Validate correctIndex
        if (correctIndex < 0 || correctIndex >= options.length) {
            return res.status(400).json({
                success: false,
                message: 'correctIndex must be a valid index in the options array'
            })
        }

        // Check if lesson exists
        const lessonDoc = await lessonCollection.doc(lessonId).get()
        if (!lessonDoc.exists) {
            return res.status(404).json({
                success: false,
                message: 'Lesson not found'
            })
        }

        const quizData = {
            lessonId,
            question,
            options,
            correctIndex,
            createdAt: new Date().toISOString()
        }

        const docRef = await quizCollection.add(quizData)

        res.status(201).json({
            success: true,
            message: 'Quiz created successfully',
            data: {
                id: docRef.id,
                ...quizData
            }
        })
    } catch (error) {
        console.error('Error creating quiz:', error)
        res.status(500).json({
            success: false,
            message: 'Error creating quiz',
            error: error.message
        })
    }
}

//Delete quiz
const deleteQuiz = async (req, res) => {
    try {
        const { lessonId, quizId } = req.params

        // Check if quiz exists and belongs to the lesson
        const quizDoc = await quizCollection.doc(quizId).get()
        if (!quizDoc.exists) {
            return res.status(404).json({
                success: false,
                message: 'Quiz not found'
            })
        }

        const quizData = quizDoc.data()
        if (quizData.lessonId !== lessonId) {
            return res.status(400).json({
                success: false,
                message: 'Quiz does not belong to the specified lesson'
            })
        }

        await quizCollection.doc(quizId).delete()

        res.status(200).json({
            success: true,
            message: 'Quiz deleted successfully'
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting quiz',
            error: error.message
        })
    }
}

module.exports = {
    getAllLessons,
    createLesson,
    updateLesson,
    deleteLesson,
    getLessonById,
    getQuizzesByLessonId,
    createQuiz,
    deleteQuiz
}