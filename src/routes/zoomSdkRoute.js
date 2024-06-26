const express = require('express');
const router = express.Router();
const zoomSdkController = require('../controllers/zoomSdkController');
const { auth } = require('../middleware/auth');

router.post('/MeetTK', auth, zoomSdkController.generateSessionJWT);
router.post('/recording', auth, zoomSdkController.handleRecording);
router.get('/recordings', auth, zoomSdkController.fetchRecordings);
router.get('/tk', auth, zoomSdkController.generateZoomApiTk);

module.exports = router;