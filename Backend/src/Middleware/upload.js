const multer = require('multer');
const path = require('path');

//config storage
const storage = multer.memoryStorage();  // Store memory for processing

//file filter
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
        cb(null, true);
    } else {
        cb(new Error('Only Images can be uploaded'));
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024  // 5mb
    },
    fileFilter: fileFilter 
});

module.exports = upload;
