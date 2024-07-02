const express = require('express');
const paymentScheduleController = require('../controllers/paymentController');
const { auth } = require('../middleware/auth');
const router = express.Router();

router.get('/payment_schedule',auth, paymentScheduleController.getPaymentSchedule);
router.post('/payment_schedule', paymentScheduleController.addPaymentSchedule);
router.post('/payments', paymentScheduleController.addPayment);
router.get('/all_payment_schedules', auth, paymentScheduleController.getAllUserPaymentSchedule);
router.get('/to_schedule',auth, paymentScheduleController.getToSchedule);

module.exports = router;
