const express = require('express');
const router = express.Router();
const recLecturesController = require('../controllers/recLecturesController');
const { auth } = require('../middleware/auth');

router.get('/rec-lectures', auth, recLecturesController.getAllRecLectures);

module.exports = router;
