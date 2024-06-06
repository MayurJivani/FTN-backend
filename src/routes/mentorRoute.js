const express = require('express');
const router = express.Router();
const mentorController = require('../controllers/mentorController');
const { auth } = require('../middleware/auth');
const fileUploadMiddleware = require('../middleware/fileUploadMiddleware');

router.get('/list', auth, mentorController.getAllMentors);
router.post('/add', fileUploadMiddleware,mentorController.addMentor);

module.exports = router;
