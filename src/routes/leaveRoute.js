const express = require('express');
const router = express.Router();
const leaveController = require('../controllers/leaveController');
const { auth } = require('../middleware/auth');

router.post('/apply', auth, leaveController.applyLeave);

module.exports = router;
