const express = require('express');
const router = express.Router();
const filesController = require('../controllers/filesController');
const fileUploadMiddleware = require('../middleware/fileUploadMiddleware');
const { auth } = require('../middleware/auth');

router.post('/upload/:sessionId', fileUploadMiddleware, filesController.fileUpload);
router.get('/list', auth, filesController.listFiles)
router.get('/download/:fileName', auth, filesController.downloadFile);

module.exports = router;
