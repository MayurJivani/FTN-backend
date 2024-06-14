const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const fileUploadMiddleware = require('../middleware/fileUploadMiddleware');
const { auth } = require('../middleware/auth');

router.get('/', auth, UserController.getAllUsers);
router.post('/register', UserController.registerUser);
router.post('/login', UserController.loginUser);
router.get('/me', auth, UserController.getUserDetails);
router.put('/update', auth, fileUploadMiddleware, UserController.updateUser);
router.get('/list', auth, UserController.getInactiveUsers);
router.put('/verify', auth, UserController.verifyUser);

module.exports = router;
