const express = require('express');
const feedbackController = require('../controllers/feedbackController');
const { auth } = require('../middleware/auth');
const router = express.Router();

router.post('/save', auth, feedbackController.saveFeedback);

module.exports = router;
