const express = require('express');
const router = express.Router();
const zoomSdkController = require('../controllers/zoomSdkController');
const { auth } = require('../middleware/auth');

router.post('/MeetTK', auth, zoomSdkController.generateSessionJWT);

module.exports = router;