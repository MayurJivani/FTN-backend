const express = require('express');
const router = express.Router();
const leaveController = require('../controllers/leaveController');
const { auth } = require('../middleware/auth');

router.post('/apply', auth, leaveController.applyLeave);
router.get('/list', auth, leaveController.listLeavesByBatch);
router.put('/status', auth, leaveController.approveOrDenyLeave);

module.exports = router;
