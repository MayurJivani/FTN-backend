const express = require('express');
const router = express.Router();
const filesController = require('../controllers/filesController');
const fileUploadMiddleware = require('../middleware/fileUploadMiddleware');
const { auth } = require('../middleware/auth');

router.post('/upload/:sessionId', fileUploadMiddleware, filesController.fileUpload);
router.get('/list', auth, filesController.listFiles)
router.get('/download/:fileName', auth, filesController.downloadFile);
router.get('/prepreplist', auth, filesController.prePreplistFiles)
router.get('/preprepdownload', auth, filesController.prePrepdownloadFile);


module.exports = router;
