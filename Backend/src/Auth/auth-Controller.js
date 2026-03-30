// controllers/authController.js
const { auth, db } = require('./../../firebase/firebase-admin');

/**
 * Register new user
 * @route POST /api/auth/register
 */
const register = async (req, res) => {
    try {
        const { email, password, name, age } = req.body;

        // Validation
        if (!email || !password || !name) {
            return res.status(400).json({
                success: false,
                message: 'Email, password, and name are required'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters'
            });
        }

        // Create Firebase Auth user
        const userRecord = await auth.createUser({
            email,
            password,
            displayName: name
        });

        // Create user document in Firestore
        const userData = {
            email,
            name,
            age: age || null,
            role: 'user',
            monthlyBudget: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        await db.collection('users').doc(userRecord.uid).set(userData);

        // Generate custom token for immediate login
        const customToken = await auth.createCustomToken(userRecord.uid);

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                uid: userRecord.uid,
                email: userRecord.email,
                name,
                customToken // Client uses this to sign in
            }
        });
    } catch (error) {
        console.error('Registration error:', error);

        if (error.code === 'auth/email-already-exists') {
            return res.status(400).json({
                success: false,
                message: 'Email already in use'
            });
        }

        if (error.code === 'auth/invalid-email') {
            return res.status(400).json({
                success: false,
                message: 'Invalid email format'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error registering user',
            error: error.message
        });
    }
};

/**
 * Get current user info
 * @route GET /api/auth/me
 */
const getCurrentUser = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            data: req.user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching user',
            error: error.message
        });
    }
};

/**
 * Delete user account
 * @route DELETE /api/auth/delete
 */
const deleteAccount = async (req, res) => {
    try {
        const { uid } = req.user;

        // Delete from Firebase Auth
        await auth.deleteUser(uid);

        // Delete from Firestore
        await db.collection('users').doc(uid).delete();

        res.status(200).json({
            success: true,
            message: 'Account deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting account',
            error: error.message
        });
    }
};

module.exports = {
    register,
    getCurrentUser,
    deleteAccount
};