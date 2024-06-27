const express = require('express');
const usersRoutes = require('./usersRoute');
const zoomRoutes = require('./zoomRoute');
const zoomSdkRoutes = require('./zoomSdkRoute');
const paymentRoutes = require('./paymentRoute');
const recLectureRoutes = require('./recLecturesRoute');
const feedbackRoutes = require('./feedbackRoute');
const leaveRoutes = require('./leaveRoute');
const mentorRoutes = require('./mentorRoute');
const fileRoutes = require('./filesRoute');
const lecturesRoutes = require('./lecturesRoute');
const batchRoutes = require('./batchRoute');
const adminRoutes = require('./adminRoute');

const router = express.Router();

router.use('/users', usersRoutes);
router.use('/zoom', zoomRoutes);
router.use('/meeting', zoomSdkRoutes);
router.use('/lecture', lecturesRoutes);
router.use('/payment', paymentRoutes);
router.use('/recording', recLectureRoutes);
router.use('/feedback', feedbackRoutes);
router.use('/leave', leaveRoutes);
router.use('/mentor', mentorRoutes);
router.use('/files', fileRoutes);
router.use('/batch', batchRoutes);
router.use('/admin', adminRoutes)

module.exports = router;
