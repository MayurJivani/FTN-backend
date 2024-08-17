const express = require('express');
const router = express.Router();
const zoomSdkController = require('../controllers/zoomSdkController');
const { auth } = require('../middleware/auth');

router.post('/MeetTK', auth, zoomSdkController.generateSessionJWT);
router.post('/recordings', auth, zoomSdkController.fetchRecordings);
router.get('/tk', auth, zoomSdkController.generateZoomApiTk);
router.post('/uploadRecording', auth, zoomSdkController.uploadRecording);
router.post('/webhook', zoomSdkController.eventsWebhook);

module.exports = router;
