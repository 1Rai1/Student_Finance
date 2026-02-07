const {Users}  = require("./../../models")
const bcrypt = require('bcryptjs')

exports.getUsers = async (req,res) => {
    try{
        const users = await Users.find()

        res.status(200).json(users)
    }
    catch (error){
            res.status(500).json({message: error.message})
        }
}

exports.registerUser = async (req,res) => {
    try{
        const {name,email,password} = req.body 
        
        const existingUser = await Users.findOne({email})
        if(existingUser) {
            return res.status(400).json({message: "User already exist"})
        }

        const hashedPass = await bcrypt.hash(password,10)

        const user = await Users.create({
            name,
            email,
            password: hashedPass,
        })

        res.status(201).json({success: true, data:{id: user._id, name: user.name, email: user.email}})
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