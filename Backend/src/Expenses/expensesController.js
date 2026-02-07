const {Transactions}  = require("../../models")

exports.getTransactions = async (req,res) => {
    try{
        const transactions = await Transactions.find()

        res.status(200).json(transactions)
    }
    catch (error){
            res.status(500).json({message: error.message})
        }
}

exports.createTransaction = async (req,res) => {
    try{
        const {category,amount,description,date,type} = req.body 
        
        const transaction = await Transactions.create({
            category,
            amount,
            description,
            date,
            type
        })

        res.status(200).json({success: true, data: transaction})
    }
     catch (error){
            res.status(500).json({message: error.message})
        }
}

    exports.getUserProfile = async(req,res) => {
        try{
            const {id} = req.body

            const verify = await Users.findById(req.param.id)

            if(!user){
                return res.status(404).json({message:"User not found"})
            }

            res.status(200).json({success: true, data: user})
        }
        catch (error){
            res.status(500).json({message: error.message})
        }
    }

    exports.updateUserProfile = async (req,res) => {
        try{
            const {name,email,password} = req.body

            const user = await Users.findByAndUpdate(req.params.id,
                {name,email,password},
                {new:true, runValidators: true}
            )
            if(!user){
                return res.status(404).json({message: "User not found"})
            }
            res.status(200).json({data: user})
        }
        catch(error){
            return res.status(500).json({message: error.message})
        }
    }
    
    exports.deleteUserProfile = async (req,res) => {
        try{
            const user = await Users.findByIdAndDelete(req.params.id)

            if(!user){
                return res.status(200).json({message: "User not found"})
            }
            return res.status(200).json({success: true, message:"User deleted successfully"})
        }
        catch (error){
            return res.status(500).json({message:error.message})
        }
    }