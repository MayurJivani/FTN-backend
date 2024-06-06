const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const fileUploadMiddleware = upload.single('file');

module.exports = fileUploadMiddleware;
