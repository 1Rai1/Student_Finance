const checkAdmin = async (req, res, next) => {
    try {
        const { adminId } = req.params; 
        // Check if admin exists and has admin role
        const { db } = require('../firebase/firebase-admin');
        const userDoc = await db.collection('users').doc(adminId).get();
        
        if (!userDoc.exists) {
            return res.status(404).json({
                success: false,
                message: "User Not Found"
            });
        }
        
        if (userDoc.data().role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: "Access Denied. Admin only."
            });
        }
        
        next();  // User is admin, proceed
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error verifying admin",
            error: error.message
        });
    }
};