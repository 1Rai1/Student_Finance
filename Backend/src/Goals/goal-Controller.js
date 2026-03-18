const {db} = require('../../firebase/firebase-admin')
//db for goals
const goalCollection = db.collection('goals')
//user reference
const userCollection = db.collection('users')

const getAllGoals = async (req,res) => {
    try{
        const snapshot = await goalCollection.get()

        if(snapshot.empty){
            return res.status(404).json({
                success:false,
                message:"No Goals Found"
            })
        }
        
        const goals = []  
        snapshot.forEach(doc => {
            goals.push({
                id:doc.id,
                ...doc.data()  
            })
        })

        res.status(200).json({
            success:true,
            count: goals.length,
            data: goals
        })
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: "Error Fetching Goals",
            error: error.message
        })
    }
}

//get user goals
const getGoalsByUserId = async(req,res) => {
    try{
        const {userId} = req.params

        const userDoc = await userCollection.doc(userId).get()
        if(!userDoc.exists){
            return res.status(404).json({
                success:false,
                message:"No User found"
            })
        }

        const snapshot = await goalCollection
            .where('userId', '==', userId)
            .get()

        if(snapshot.empty){
            return res.status(404).json({
                success:false,
                message:"No Goals Found For This User"
            })
        }

        const goals = []
        snapshot.forEach(doc => {
            goals.push({
                id:doc.id,
                ...doc.data()  
            })
        })

        res.status(200).json({
            success:true,
            count: goals.length,
            data: goals
        }) 
    }
    catch(error){
        res.status(500).json({
            success:false,
            message:"Error Fetching User Goals",
            error:error.message
        })
    }
} 

//get goal by id
const getGoalById = async (req,res) => {
    try{
        const { goalId } = req.params  

        const goalDoc = await goalCollection.doc(goalId).get()
        if(!goalDoc.exists){
            return res.status(404).json({
                success:false,
                message:"No Goals Found"
            })
        }

        res.status(200).json({
            success:true,
            data: {
                id: goalDoc.id,
                ...goalDoc.data()  
            }
        })
    }
    catch(error){
        res.status(500).json({
            success:false,
            message:"Error Fetching Goals",
            error: error.message
        })
    }
}

//create your goal
const createGoal = async (req,res) => {
    try{
        //user id
        const {userId} = req.params
        //goals 
        const {title, description, targetAmount, currentAmount, deadline, category} = req.body

        if(!title || !targetAmount){  
            return res.status(400).json({
                success:false,
                message:"Title And Target Amount Is Needed"
            })
        }

        const userDoc = await userCollection.doc(userId).get()
        if(!userDoc.exists){
            return res.status(404).json({
                success:false,
                message:"No User Found"
            })
        }
        
        const goalData = {
            userId,
            title,
            description: description || '',
            targetAmount: parseFloat(targetAmount),
            currentAmount: parseFloat(currentAmount) || 0,  
            deadline: deadline || null,
            category: category || 'general',
            status:'active',
            progress: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
        
        if(goalData.targetAmount > 0){
            goalData.progress = (goalData.currentAmount / goalData.targetAmount) * 100
        }

        const docRef = await goalCollection.add(goalData)

        res.status(201).json({
            success:true,
            message: "Goal Created Successfully",
            data:{
                id: docRef.id,
                ...goalData
            }
        })
    }
    catch(error){
        res.status(500).json({
            success:false,
            message:"Error Creating Goals",
            error: error.message
        })
    }
}

//update Goal 
const updateGoals = async (req,res) => {
    try{
        const {goalId} = req.params

        const {title, description, targetAmount, currentAmount, deadline, category, status} = req.body
        
        const goalDoc = await goalCollection.doc(goalId).get()  
        if(!goalDoc.exists){
            return res.status(404).json({
                success:false,
                message:"No Goals Found"
            })
        }

        const updateData = {
            ...(title && {title}),
            ...(description !== undefined && {description}),
            ...(targetAmount !== undefined && {targetAmount:parseFloat(targetAmount)}),
            ...(currentAmount !== undefined && {currentAmount:parseFloat(currentAmount)}),
            ...(deadline !== undefined && {deadline}),
            ...(category && {category}),
            ...(status && {status}),
            updatedAt: new Date().toISOString()  
        }

        //Calculate Progress
        const currentData = goalDoc.data()
        const newTargetAmount = updateData.targetAmount || currentData.targetAmount
        const newCurrentAmount = updateData.currentAmount !== undefined ? updateData.currentAmount : currentData.currentAmount  

        if(newTargetAmount > 0){
            updateData.progress = (newCurrentAmount / newTargetAmount) * 100 
        }

        if(newCurrentAmount >= newTargetAmount && currentData.status === 'active'){
            updateData.status = 'completed'
            updateData.completedAt = new Date().toISOString()
        }
        
        //Update
        await goalCollection.doc(goalId).update(updateData)
        //Get updated
        const updateDoc = await goalCollection.doc(goalId).get()  

        //return updated data
        res.status(200).json({
            success: true,
            message: "Goal Updated Successfully",
            data: {
                id: updateDoc.id,
                ...updateDoc.data() 
            }
        })
    }
    catch(error){
        res.status(500).json({
            success:false,
            message: "Error Updating Goal",
            error: error.message
        })
    }
}

//delete
const deleteGoal = async (req,res) => {
    try{
        const {goalId} = req.params

        //check if goal exists
        const goalDoc = await goalCollection.doc(goalId).get()
        if(!goalDoc.exists){
            return res.status(404).json({
                success:false,
                message:"Goal not Found"
            })
        }
        await goalCollection.doc(goalId).delete()

        res.status(200).json({
            success:true,
            message:"Goal Successfully Deleted"
        })
    }
    catch(error){
        res.status(500).json({
            success:false,
            message: "Error Deleting Goal",
            error: error.message
        })
    }
}

//Progress Increment the goals
const addProgress = async (req,res) =>{  
    try{
        const {goalId} = req.params
        const {amount} = req.body
        
        //validate amount
        if(!amount || amount <= 0){ 
            return res.status(400).json({
                success: false,
                message:"Amount Must Not Be Empty And Must Be Greater Than 0"
            })
        }
        
        //check goal
        const goalDoc = await goalCollection.doc(goalId).get()
        if(!goalDoc.exists){
            return res.status(404).json({
                success:false,
                message:"Goal Not Found"
            })
        }

        const goalData = goalDoc.data()
        const newCurrentAmount = goalData.currentAmount + parseFloat(amount)
        const newProgress = (newCurrentAmount / goalData.targetAmount) * 100

        const updateData = {
            currentAmount: newCurrentAmount,
            progress: newProgress,
            updatedAt: new Date().toISOString()  
        }

        if(newCurrentAmount >= goalData.targetAmount && goalData.status === 'active'){
            updateData.status = 'completed'
            updateData.completedAt = new Date().toISOString()  
        }

        //update Progress
        await goalCollection.doc(goalId).update(updateData)
        //get updated
        const updatedProgress = await goalCollection.doc(goalId).get()  

        res.status(200).json({
            success:true,
            message:"Progress Updated Successfully",
            data: {
                id: updatedProgress.id,
                ...updatedProgress.data()  
            }
        })
    }
    catch(error){
        res.status(500).json({
            success:false,
            message:"Error Adding Progress",
            error:error.message
        })
    }
}

//users with their goals
const getUserWithGoals = async (req,res) => {
    try{
        const {userId} = req.params  

        //check user 
        const userDoc = await userCollection.doc(userId).get()
        if(!userDoc.exists){
            return res.status(404).json({  
                success:false,
                message:"User Not Found"
            })
        }
        
        //get goals
        const goalSnapshot = await goalCollection
            .where('userId', '==', userId)
            .get()

        const goals = []
        goalSnapshot.forEach(doc => {
            goals.push({
                id: doc.id,
                ...doc.data()  
            })
        })

        res.status(200).json({
            success:true,
            data:{
                user:{
                    id:userDoc.id,
                    ...userDoc.data()  
                },
                goals: goals,
                totalGoals: goals.length,
                activeGoals: goals.filter(g => g.status === 'active').length,
                completedGoals: goals.filter(g => g.status === 'completed').length  
            }
        })
    }
    catch(error){
        res.status(500).json({
            success:false,
            message:"Error Fetching User Goals",
            error: error.message
        })
    }
}

module.exports = {
    getAllGoals,
    getGoalById,
    getGoalsByUserId,
    createGoal,
    updateGoals,
    deleteGoal,
    addProgress,
    getUserWithGoals
}