const {db} = require('../../firebase/firebase-admin')

//reference
const userCollection = db.collection('users')

//Get all user
const getAllUser = async (req, res) => {
    try{
        const snapshot = await userCollection.get()

        if(!snapshot){
            return res.status(404).json({message: "No Users Found"})
                }
        const users = []
        snapshot.forEach(doc => {
            users.push({
                id:doc.data,
                ...doc.data()
            })
        })

        res.status(200).json({
            success:true,
            count: users.length,
            data: users    
        })
    }
    catch(error){
        return res.status(500).json({
            success: false, 
            message:"Error Fetching Users",
            error: error.message})
    }
}

//Get User by ID
 const getUserById = async (req,res) => {
    try{
        const {id} = req.body

        const userDoc = await userCollection.doc(id).get()

        if(!userDoc.exists){
            return res.status(404).json({
                success:false,
                message: "User not Found"
            })
        }
        res.status(200).json({
            success:true,
            data: userDoc(id),
                ...userDoc.data()
        })

    }
    catch(error){
        return res.status(500).json({
            success:false,
            message: "Erro fetching User",
            error: error.message
        })
    }

 }

 //Create User
const createUser = async (req,res) => {
    try{
        const {name,email,password,role,age} = req.body
           console.log('Request body:', req.body); // Debug log
    console.log('DB instance:', db); // Check if db exists
    

        if(!name || !email || !password){
            return res.status(400).json({
                success: false,
                message:"Credentials required"})

        }

        const existingUser = await userCollection.where('email' ,'=', email).get()
        if(!existingUser.empty){
            return res.status(400).json({
                success: false,
                message: "User already exist"
            })
        }
        const userData = {
            name,
            email,
            password,
            age: age || null,
            role: role || 'user',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()

        }
        const docRef = await userCollection.add(userData)

        res.status(200).json({
            success:true,
            message:"User Created Successfully",
            data: {
                id:docRef.id,//User Reference
                ...userData
            }
        })
    }
    catch(error){
        console.error('Full error:', error); // See full error
         res.status(500).json({
            success:false,
            message:"Error Creating User",
            error: error.message
        })
    }
}

//Update User
const updateUser = async(req,res) => {
    try{
        const {id} = req.params
        const {name,email,password,age} = req.body
        //Check if User exist
        const userDoc = await userCollection.doc(id).get()
        //Return if user not found
        if(!userDoc.exists){
            return res.status(404).json({
                success:false,
                message:"User Not Found"
            })    
        }

          // If email is being updated, check if it's already taken by another user
         if (email && email !== userDoc.data().email) {
            const existingUser = await usersCollection.where('email', '==', email).get()
      
        if (!existingUser.empty) {
            return res.status(400).json({
                success: false,
                message: 'Email already exists'
            })
         }
        }
        //Only update if value is truthy or may laman
        const updateData = {
           ...(name && {name}),
           ...(email && {email}),
           ...(password && {password}),
           ...(age != undefined && {age}),
           ...(role && {role}),
           updatedAt: new Date().toISOString()
        }

        await userCollection.doc(id).update(updateData)

        const updatedDoc = await userCollection.doc(id).get()

        res.status(200).jons({
            success: true,
            message: "User Updated Successfully",
            data: updatedDoc.id,
                ...updatedDoc.data()
        })
        }
    catch(error){
        return res.status(500).json({
            success: false,
            message: "Error Updating User",
            error: error.message
        })
    }
}

//Delete User
const deleteUser = async(req,res) => {
    try{
        const {id} = req.params

        //check if user exist
        const userDoc = await userCollection.doc(id).get()
        if(!userDoc.exists){
            return res.status(404).json({
                success:false,
                message:"User not found"
            })
        }

        await userCollection.doc(id).delete()

        res.status(200).json({
            success:true,
            message:"User Deleted Successfully"
        })
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Error Deleting User",
            error: error.message
        })
    }
}

//search Users admin only
const getUsersByQuery = async (req, res) => {
  try {
    const { role, name } = req.query;
    let query = usersCollection;

    if (role) {
      query = query.where('role', '==', role);
    }

    // Note: Firestore doesn't support case-insensitive queries natively
    // For name search, you'd need to implement a different strategy
    if (name) {
      query = query.where('name', '==', name);
    }

    const snapshot = await query.get();

    if (snapshot.empty) {
      return res.status(404).json({
        success: false,
        message: 'No users found matching the query'
      });
    }

    const users = [];
    snapshot.forEach(doc => {
      users.push({
        id: doc.id,
        ...doc.data()
      });
    });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error querying users',
      error: error.message
    });
  }
};

module.exports ={
    getAllUser,
    createUser,
    updateUser,
    deleteUser,
    getUsersByQuery,
    getUserById
}