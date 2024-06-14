const express = require('express');
const router = express.Router();
const BatchController = require('../controllers/batchController');
const { auth } = require('../middleware/auth');

router.get('/list', auth, BatchController.getBatches);

module.exports = router;
