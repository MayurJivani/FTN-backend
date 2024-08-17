const paymentsModel = require('../models/paymentsModel');
const userModel = require('../models/userModel');
const { sendEmailFromTemplate } = require('../utils/sendEmail');


const generateSchedule = (initial_start, pdc_start, initial_amount, pdc_amount, total_emi, total_pdc, admission_date) => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
  const initialIndex = months.indexOf(initial_start);
  const pdcIndex = months.indexOf(pdc_start);
  const admissionYear = new Date(admission_date).getFullYear();

  const generateMonthlySchedule = (startIndex, amount, totalMonths) => {
    const schedule = {};
    let currentYear = admissionYear;

    for (let i = 0; i < totalMonths; i++) {
      const month = months[(startIndex + i) % 12];
      if (startIndex + i >= 12) {
        currentYear++;
      }
      schedule[`${month} - ${currentYear}`] = { "Amount": amount, "Status": "Pending" };
    }

    return schedule;
  };

  return {
    "Initial": generateMonthlySchedule(initialIndex, initial_amount, total_emi),
    "PDC": generateMonthlySchedule(pdcIndex, pdc_amount, total_pdc)
  };
};

const addPaymentSchedule = async (req, res) => {
  try {
    const {
      UserId,
      Admission_date,
      Total_Fees,
      Total_EMI,
      Total_PDC,
      initial_start,
      pdc_start,
      initial_amount,
      pdc_amount
    } = req.body;

    if (req.user.role !== "admin") {
        return res.status(401).json({ error: "Unauthorized" });
    }

    // Ensure all required fields are present
    if (!UserId || !Admission_date || !Total_Fees || !Total_EMI || !Total_PDC || !initial_start || !pdc_start || !initial_amount || !pdc_amount) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const Schedule = generateSchedule(initial_start, pdc_start, initial_amount, pdc_amount, Total_EMI, Total_PDC, Admission_date);

    const paymentData = {
      UserId,
      Admission_date,
      Total_Fees,
      Total_EMI,
      Total_PDC,
      Schedule
    };

    const insertedRecord = await paymentsModel.insertPaymentSchedule(paymentData);

    res.status(201).json({
      message: 'Payment schedule inserted successfully',
      insertedRecord
    });
  } catch (err) {
    console.error('Error inserting payment schedule', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getPaymentSchedule = async (req, res) => {
    try {

      const userId = req.user.id;
  
      const schedule = await paymentsModel.getPaymentScheduleByUserId(userId);
  
      if (!schedule) {
        return res.status(404).json({ message: 'Payment schedule not found' });
      }
  
      res.status(200).json(schedule);
    } catch (err) {
      console.error('Error fetching payment schedule', err);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  // Function to get all payment schedules
  const getAllUserPaymentSchedule = async (req, res) => {

    if (req.user.role !== "admin") {
        return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const schedules = await paymentsModel.getAllPaymentSchedules();
      res.status(200).json(schedules);
    } catch (err) {
      console.error('Error fetching all payment schedules', err);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  // Function to get users who don't have a schedule
  const getToSchedule = async (req, res) => {

    if (req.user.role !== "admin") {
        return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const usersWithoutSchedule = await paymentsModel.getUsersWithoutSchedule();
      res.status(200).json(usersWithoutSchedule);
    } catch (err) {
      console.error('Error fetching users without schedule', err);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  const addPayment = async (req, res) => {
    const { userId, amount, paymentDate, paymentMethod, paymentType } = req.body;

    if (req.user.role !== "admin") {
        return res.status(401).json({ error: "Unauthorized" });
    }
  
    try {
        // Retrieve the payment schedule, which includes the admission date
        const schedule = await paymentsModel.getPaymentScheduleByUserId(userId);
        
        if (!schedule) {
            return res.status(404).json({ error: "Payment schedule not found for the user" });
        }

        const admissionDate = new Date(schedule.admission_date);

        const payment = await paymentsModel.addPayment(userId, amount, paymentDate, paymentMethod, paymentType);
        const user = await userModel.getUserById(userId);

        // Update payment schedule status
        const paymentMonth = new Date(paymentDate).getMonth() + 1; // months are 0-based
        const paymentYear = new Date(paymentDate).getFullYear();

        // Determine if the payment is for EMI or PDC and find the correct month
        const paymentTypeSchedule = paymentType === 'EMI' ? schedule.schedule.Initial : schedule.schedule.PDC;
        const paymentMonthName = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(new Date(paymentYear, paymentMonth - 1));

        // Update status based on payment date
        const paymentDueDate = new Date(paymentYear, paymentMonth - 1, admissionDate.getDate());
        const paymentStatus = new Date(paymentDate) <= paymentDueDate ? 'Received' : 'Delayed';

        if (paymentTypeSchedule[paymentMonthName] && paymentTypeSchedule[paymentMonthName].Amount === amount) {
            paymentTypeSchedule[paymentMonthName].Status = paymentStatus;
        }

        
        await paymentsModel.updatePaymentSchedule(userId, schedule);

        const emailReplacements = {
            username: user.username,
            batch: user.batch_id,
            receiptNumber: payment.payment_id,
            paymentDate: paymentDate,
            amount: amount,
            paymentType: paymentType,
            InstallmentNo: "*To Be Implemented*",
            PaymentMode: payment.payment_method,
        };

        await sendEmailFromTemplate(user.email, 'Payment Confirmation', 'paymentConfirmation.html', emailReplacements);
        res.status(201).json(payment);
    } catch (error) {
        console.error('Error adding payment:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


  module.exports = {
    getPaymentSchedule,
    getAllUserPaymentSchedule,
    getToSchedule,
    addPaymentSchedule, 
    addPayment,
  };
