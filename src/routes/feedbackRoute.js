const express = require('express');
const feedbackController = require('../controllers/feedbackController');
const { auth } = require('../middleware/auth');
const router = express.Router();

router.post('/save', auth, feedbackController.saveFeedback);
router.get('/list', auth, feedbackController.listFeedback)

module.exports = router;
