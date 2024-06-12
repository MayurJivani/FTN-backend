const express = require('express');
const router = express.Router();
const lecturesController = require('../controllers/lecturesController');
const { auth } = require('../middleware/auth');

router.post('/schedule', auth, lecturesController.scheduleLecture);
router.get('/list', auth, lecturesController.listLecturesFromToday);
router.get('/today', auth, lecturesController.listLecturesForToday);

module.exports = router;