// controllers/userController.js
const { db } = require('./../../firebase/firebase-admin');

const userCollection = db.collection('users');

// Get all users (Admin only)
const getAllUser = async (req, res) => {
    try {
        const snapshot = await userCollection
            .orderBy('createdAt', 'desc')
            .get();

        if (snapshot.empty) {
            return res.status(404).json({
                success: false,
                message: "No Users Found"
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
            message: "Error Fetching Users",
            error: error.message
        });
    }
};

// Get user by ID
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        const userDoc = await userCollection.doc(id).get();

        if (!userDoc.exists) {
            return res.status(404).json({
                success: false,
                message: "User not Found"
            });
        }
        
        res.status(200).json({
            success: true,
            data: {
                id: userDoc.id,
                ...userDoc.data()
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching User",
            error: error.message
        });
    }
};

// Update user
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, age, monthlyBudget } = req.body;
        
        const userDoc = await userCollection.doc(id).get();
        
        if (!userDoc.exists) {
            return res.status(404).json({
                success: false,
                message: "User Not Found"
            });
        }

        const updateData = {
            ...(name && { name }),
            ...(age !== undefined && { age }),
            ...(monthlyBudget !== undefined && { monthlyBudget: parseFloat(monthlyBudget) }),
            updatedAt: new Date().toISOString()
        };

        await userCollection.doc(id).update(updateData);

        const updatedDoc = await userCollection.doc(id).get();

        res.status(200).json({
            success: true,
            message: "User Updated Successfully",
            data: {
                id: updatedDoc.id,
                ...updatedDoc.data()
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error Updating User",
            error: error.message
        });
    }
};

// Delete user
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const userDoc = await userCollection.doc(id).get();
        if (!userDoc.exists) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        await userCollection.doc(id).delete();

        res.status(200).json({
            success: true,
            message: "User Deleted Successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error Deleting User",
            error: error.message
        });
    }
};

// Search users (Admin only)
const getUsersByQuery = async (req, res) => {
    try {
        const { role, name } = req.query;
        let query = userCollection;

        if (role) {
            query = query.where('role', '==', role);
        }

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

module.exports = {
    getAllUser,
    getUsersByQuery,
    getUserById,
    updateUser,
    deleteUser
};