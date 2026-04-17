// controllers/userController.js
const { db } = require('./../../firebase/firebase-admin');
const cloudinary = require('../Middleware/cloudinary'); // Your new config file
const sharp = require('sharp');

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
            return res.status(404).json({ success: false, message: "User Not Found" });
        }

        let profilePicUrl = userDoc.data().profilePic || '';

        // Check if a new image was uploaded
        if (req.file) {
            // 1. Process image with Sharp (Profile pics are usually square)
            const processedImage = await sharp(req.file.buffer)
                .resize(500, 500, { fit: 'cover' }) // 'cover' crops to a square
                .jpeg({ quality: 80 })
                .toBuffer();

            // 2. Upload to Cloudinary
            const uploadResult = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream({
                    folder: 'profile-pics',
                    public_id: `user-${id}`, // Overwrites the old pic for this user
                    resource_type: 'image'
                }, (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }).end(processedImage);
            });

            profilePicUrl = uploadResult.secure_url;
        }

        const updateData = {
            ...(name && { name }),
            ...(age !== undefined && { age }),
            ...(monthlyBudget !== undefined && { monthlyBudget: parseFloat(monthlyBudget) }),
            profilePic: profilePicUrl, // Add this field
            updatedAt: new Date().toISOString()
        };

        await userCollection.doc(id).update(updateData);

        res.status(200).json({
            success: true,
            message: "User Updated Successfully",
            data: { id, ...updateData }
        });

    } catch (error) {
        res.status(500).json({ success: false, message: "Error Updating User", error: error.message });
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