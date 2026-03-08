const {db,bucket} = require('./../../firebase/firebase-admin')
const sharp = require('sharp')
const path = require('path')
const { count } = require('console')
const discountCollection = db.collection('discounts')
const userCollection = db.collection('users')


//get all discounts
const getAllDiscount = async(req, res) => {
    try{
        const snapshot = await discountCollection.
        where('isActive', '==', true).
        orderBy('createdAt', 'desc').
        get()
        
        //check if empty
        if(snapshot.empty){
            return res.status(404).json({
                success: false,
                message: "No Discounts Found"
            })
        }

        const discount = []
        snapshot.forEach(doc => {
            discount.push({
                id: doc.id,
                ...doc.data()
            })
        })

        res.status(200).json({
            success: true,
            count: discount.length,
            data: discount
        })

    }
    catch(error){
        return res.status(500).json({
            success: false,
            messsage: "Error Getting Discounts",
            error: error.messsage
        })
    }
}

//get discount by userID
const getDiscountByUserId = async(req,res) => {
    try{
        const {userId} = req.params

        const userDoc = await userCollection.doc(userId).get()
        if(!userDoc.exists){
            return res.status(404).json({
                success: false,
                message: "No User Found"
            })
        }
        const snapshot = await discountCollection
        .where('userId', '==', userId)
        .get()

        if(snapshot.empty){
            return res.status(404).json({
                success: false,
                message: "No Discount Post"
            })
        }
        const discount = []
        discount.forEach = (doc => {
            discount.push({
                id: doc.id,
                ...doc.data()
            })
        })

        res.status(200).json({
            success: true,
            count: discount.length,
            data: discount
        })
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: "Error Fetching Discounts By User Id",
            error: error.message
        })
    }
}

//create discount
const createDiscount = async(req,res) => {
    try{

    }
    catch(error){
        return res.status(500).json({
            success:false,
            message: "Error Creating Post",
            error: error.messsage
        })
    }
}