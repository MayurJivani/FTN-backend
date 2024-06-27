const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { auth } = require('../middleware/auth');

router.post('/login', adminController.loginAdmin);

module.exports = router;
