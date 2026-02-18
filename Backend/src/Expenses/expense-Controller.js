const {db} = require('../../firebase/firebase-admin')

//db for expense
const expenseCollection = db.collection('expenses')
//ref user
const userCollection = db.collection('users')

const getAllExpenses = async (req,res) => {
    try{
        //get them expenses
        const snapshot = await expenseCollection.get()
        //check if not empty
        if(snapshot.empty){
            return res.status(404).json({
                success: false,
                message: "No Expenses Found"
            })
        }
        const expenses = []
        snapshot.forEach(doc => {
            expenses.push({
                id: doc.id,
                ...doc.data()
            })
        })

        res.status(200).json({
            success: true,
            count: expenses.length,
            data: expenses
        })
    }
    catch(error){
        res.status(500).json({
            success: false,
            message: "Error Fetching Expenses",
            error: error.message
        })
    }
}

//get them expenses for a spisipic usir
const getExpenseByUserId = async (req,res) => {
    try{
        const {userId} = req.params

        //check if user is not a ghost
        const userDoc = await userCollection.doc(userId).get()
        if(!userDoc.exists){
            return res.status(404).json({
                success:false,
                message:"User Not Found"
            })
        }

        const snapshot = await expenseCollection.
        where('userId', '==', userId).get()

        const expenses = []
        snapshot.forEach(doc => {
            expenses.push({
                id: doc,
                ...doc.data()
            })
        })

        res.status(200).json({
            success: true,
            count: expenses.length,
            data: expenses
        })
    }
    catch(error){
        res.status(500).json({
            success:false,
            message:"Error Fetching User Expenses",
            error:error.message
        })
    }
}
//get expense by id might not be used
const getExpenseById = async (req,res) => {
    try{
        const {expenseId} = req.params
        const expenseDoc = await expenseCollection.doc(id).get()
        if(!expenseDoc.exists){
            return res.status(404).json({
                success:false,
                message: "No Expense Found"
            })
        }
        res.status(200).json({
            success: true,
            data: {
                id: expenseDoc.id,
                ...expenseDoc.data()
            }
        })
    }
    catch(error){
        res.status(500).json({
            success:false,
            message: "Error Fetching Expense",
            error: error.message
        })
    }
}

//create expense
const createExpense = async(req,res) => {
    try{
        const {userId} = req.params
        const {title, description, amount} = req.body
        //check proper amount
        if(!amount || amount <= 0){
            return res.status(400).json({
                success:false,
                message: "Amount Must Be Greater Than Zero"
            })
        }
        //check user
        const userDoc = await userCollection.doc(userId).get()
        if(!userDoc.exists){
            return res.status(404).json({
                success:false,
                message:"User Not Found"
            })
        }
        const expenseData = {
            userId,
            title,
            description: description || '',
            amount: parseFloat(amount),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toDateString()
        }
       const expenseDoc = await expenseCollection.add(expenseData)

       res.status(201).json({
        success:true,
        data: {
            id: expenseDoc.id,
            ...expenseDoc.data()
        }
       })

    }
    catch(error){
        res.status(500).json({
            success:false,
            message: "Error Creating Expenses",
            error: error.message
        })
    }
}

//update expense
const updateExpense = async(req,res) => {
    try{
        const {expenseId} = req.params
        const {title,description,amount} = req.body
        //check amount
        if(!amount || amount <= 0){//! = not baliktad
            return res.status(400).json({
                success: false,
                message: "Amount Must Be Greater Than Zero"
            })
        }
        const expenseDoc = await expenseCollection.doc(expenseId).get()//either true or false get still
        //check expense exists
        if(!expenseDoc.exists){
            return res.status(404).json({
                success:false,
                message: "Expense does not exist"
            })
        }
        const updatedExpense = {
            ...(title && {title}),
            ...(description && {description}),
            ...(amount != undefined && {amount})
        }
        
        await expenseCollection.update(updatedExpense)//update

        const updatedDoc = await expenseCollection.doc(expenseId).get() //return updated value
        
        res.status(200).json({
            success: true,
            data: {
                id: updatedDoc.id,
                ...updatedDoc.data()            }
        })
    }
    catch(error){
        res.status(500).json({
            success:false,
            message:"Error Updating Expense",
            error: error.message
        })
    }
}
//delete
const deleteExpense = async(req,res) => {
    try{
        const {expenseId} = req.params

        //check if expense exist
        const expenseDoc = await expenseCollection.doc(expenseId).get()
        if(!expenseDoc.exists){
            return res.status(404).json({
                success:false,
                message:"Expense Not Found"
            })
        }      
    }
    catch(error){

    }
}