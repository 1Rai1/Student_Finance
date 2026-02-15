const admin = require('firebase-admin');
const path = require('path');

const initializeFirebase = () => {
  try {
    if (process.env.FIREBASE_PRIVATE_KEY) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        }),
        databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`,
        storageBucket: `${process.env.FIREBASE_PROJECT_ID}.appspot.com`
      });
    } 
    // Method 2: Using service account file (for development)
    else {
      const serviceAccountPath = path.join(__dirname, 'service-account.json');
      const serviceAccount = require(serviceAccountPath);
      
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`,
        storageBucket: `${serviceAccount.project_id}.appspot.com`
      });
    }

    console.log('Firebase Admin SDK initialized successfully');
    return admin;
  } catch (error) {
    console.error('Firebase Admin SDK initialization error:', error);
    process.exit(1);
  }
};

// Initialize and get services
const firebaseAdmin = initializeFirebase();

// Export services
const db = firebaseAdmin.firestore();
const auth = firebaseAdmin.auth();
const storage = firebaseAdmin.storage();
const messaging = firebaseAdmin.messaging();

module.exports = {
  admin: firebaseAdmin,
  db,
  auth,
  storage,
  messaging
};