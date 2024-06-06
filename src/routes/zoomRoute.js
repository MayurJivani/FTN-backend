const express = require('express');
const router = express.Router();
const zoomController = require('../controllers/zoomController');

router.get('/auth', zoomController.generateAuthUrl);
router.get('/token', zoomController.exchangeToken);
router.post('/token/callback', zoomController.exchangeToken);

module.exports = router;