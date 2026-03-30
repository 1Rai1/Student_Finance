// middleware/auth.js
const { auth, db } = require('./../../firebase/firebase-admin');

/**
 * Verify Firebase ID token from client
 */
const verifyToken = async (req, res, next) => {
    try {
        // Get token from Authorization header
        const token = req.headers.authorization?.split('Bearer ')[1];
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'No token provided. Please login.'
            });
        }

        // Verify Firebase ID token
        const decodedToken = await auth.verifyIdToken(token);
        
        // Get user data from Firestore
        const userDoc = await db.collection('users').doc(decodedToken.uid).get();
        
        if (!userDoc.exists) {
            return res.status(404).json({
                success: false,
                message: 'User not found in database'
            });
        }

        // Attach user to request
        req.user = {
            uid: decodedToken.uid,
            email: decodedToken.email,
            ...userDoc.data()
        };
        
        next();
    } catch (error) {
        console.error('Token verification error:', error);
        
        if (error.code === 'auth/id-token-expired') {
            return res.status(401).json({
                success: false,
                message: 'Token expired. Please login again.'
            });
        }
        
        if (error.code === 'auth/argument-error') {
            return res.status(401).json({
                success: false,
                message: 'Invalid token format'
            });
        }
        
        res.status(401).json({
            success: false,
            message: 'Invalid token',
            error: error.message
        });
    }
};

/**
 * Verify user is admin
 */
const verifyAdmin = async (req, res, next) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Admin privileges required.'
            });
        }
        next();
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error verifying admin',
            error: error.message
        });
    }
};

/**
 * Verify user owns the resource
 */
const verifyOwnership = (req, res, next) => {
    const resourceId = req.params.id || req.params.userId;
    
    // Admin can access anything, or user can access their own
    if (req.user.uid !== resourceId && req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Access denied. You can only manage your own resources.'
        });
    }
    
    next();
};

module.exports = {
    verifyToken,
    verifyAdmin,
    verifyOwnership
};