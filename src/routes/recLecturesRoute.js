const express = require('express');
const router = express.Router();
const recLecturesController = require('../controllers/recLecturesController');
const { auth } = require('../middleware/auth');

router.get('/rec-lectures', auth, recLecturesController.getAllRecLectures);
router.get('/recorded-lectures', auth, recLecturesController.getBatchWiseRecLectures);
router.post('/add-recording', auth, recLecturesController.insertRecLecture);
router.post('/get-url', auth, recLecturesController.getUrl)

module.exports = router;
