// controllers/authController.js
const { auth, db } = require('../../firebase/firebase-admin');

/**
 * Register new user
 * @route POST /api/auth/register
 */
const register = async (req, res) => {
    try {
        const { email, password, name, age } = req.body;

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

        const userRecord = await auth.createUser({
            email,
            password,
            displayName: name
        });

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

        const customToken = await auth.createCustomToken(userRecord.uid);

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                uid: userRecord.uid,
                email: userRecord.email,
                name,
                customToken
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        if (error.code === 'auth/email-already-exists') {
            return res.status(400).json({ success: false, message: 'Email already in use' });
        }
        if (error.code === 'auth/invalid-email') {
            return res.status(400).json({ success: false, message: 'Invalid email format' });
        }
        res.status(500).json({ success: false, message: 'Error registering user', error: error.message });
    }
};

/**
 * Get custom token for existing user – NO PASSWORD VERIFICATION (for development)
 * @route POST /api/auth/token
 */
const getCustomToken = async (req, res) => {
    try {
        const { email } = req.body;  // password is ignored
        if (!email) {
            return res.status(400).json({ success: false, message: 'Email required' });
        }

        // Find user in Firestore by email
        const userQuery = await db.collection('users').where('email', '==', email).limit(1).get();
        let uid = null;
        userQuery.forEach(doc => { uid = doc.id; });
        if (!uid) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Generate custom token (no password check)
        const customToken = await auth.createCustomToken(uid);
        res.json({ success: true, data: { customToken } });
    } catch (error) {
        console.error('Get custom token error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Get current user info
 * @route GET /api/auth/me
 */
const getCurrentUser = async (req, res) => {
    try {
        res.status(200).json({ success: true, data: req.user });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching user', error: error.message });
    }
};

/**
 * Delete user account
 * @route DELETE /api/auth/delete
 */
const deleteAccount = async (req, res) => {
    try {
        const { uid } = req.user;
        await auth.deleteUser(uid);
        await db.collection('users').doc(uid).delete();
        res.status(200).json({ success: true, message: 'Account deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error deleting account', error: error.message });
    }
};

module.exports = {
    register,
    getCustomToken,
    getCurrentUser,
    deleteAccount
};