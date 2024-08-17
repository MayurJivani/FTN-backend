const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const { auth } = require('../middleware/auth');

router.get('/list', auth, attendanceController.getAllAttendance);

module.exports = router;
