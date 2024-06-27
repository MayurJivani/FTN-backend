const paymentScheduleModel = require('../models/paymentModel');

const calculateNextPaymentDate = (startDate, totalInstallmentsLeft, lastPaymentDate) => {
    // Create a new date object based on the start date
    let nextPaymentDate = new Date(startDate);

    // If there are no previous payments, return the start date as the next payment date
    if (!lastPaymentDate) {
        return nextPaymentDate;
    }

    // Calculate the difference in months between the start date and the last payment date
    const monthsDiff = (lastPaymentDate.getFullYear() - nextPaymentDate.getFullYear()) * 12 +
        lastPaymentDate.getMonth() - nextPaymentDate.getMonth();

    // Increment the next payment date by the number of months left in the installment schedule
    nextPaymentDate.setMonth(nextPaymentDate.getMonth() + monthsDiff + 1);

    return nextPaymentDate;
};


// Function to calculate the final payment date
const calculateFinalPaymentDate = (nextPaymentDate, totalInstallmentsLeft) => {
    const finalPaymentDate = new Date(nextPaymentDate);
    finalPaymentDate.setMonth(finalPaymentDate.getMonth() + totalInstallmentsLeft - 1);
    return finalPaymentDate;
};

// Function to find the previous payment date
const findPreviousPayment = (payments, finalPaymentDate) => {
    let previousPaymentDate = null;
    for (let i = payments.length - 1; i >= 0; i--) {
        if (payments[i].payment_date < finalPaymentDate) {
            previousPaymentDate = payments[i].payment_date;
            break;
        }
    }
    return previousPaymentDate;
};

// Endpoint to get payment schedule
const getPaymentSchedule = async (req, res) => {
    const userId = req.user.id;

    try {
        const schedule = await paymentScheduleModel.getPaymentScheduleByUserId(userId);
        if (!schedule) {
            return res.status(404).json({ error: 'Payment schedule not found for the user' });
        }

        const { total_installments, start_date, total_amt } = schedule;
        const emiAmount = total_amt / total_installments;

        const payments = await paymentScheduleModel.getPaymentsByUserId(userId);
        const totalPaymentsMade = payments.length;
        const totalInstallmentsLeft = total_installments - totalPaymentsMade;
        const totalAmountLeft = totalInstallmentsLeft * emiAmount;

        if (totalPaymentsMade === 0) {
            return res.status(404).json({ error: 'No payments found for the user' });
        }

        const lastPaymentDate = payments[payments.length - 1].payment_date;
        const nextPaymentDate = calculateNextPaymentDate(new Date(start_date), totalInstallmentsLeft, lastPaymentDate);
        const finalPaymentDate = calculateFinalPaymentDate(nextPaymentDate, totalInstallmentsLeft);
        const previousPaymentDate = findPreviousPayment(payments, finalPaymentDate);

        res.json({
            start_date: new Date(start_date).toDateString(),
            total_installments,
            previous_payment: previousPaymentDate ? previousPaymentDate.toDateString() : null,
            next_payment: nextPaymentDate.toDateString(),
            final_payment: finalPaymentDate.toDateString(),
            all_payments: payments.map(payment => ({
                payment_date: new Date(payment.payment_date).toDateString(),
                amount: payment.amount
            })),
            payments_left: totalInstallmentsLeft,
            total_amount_left: totalAmountLeft.toFixed(2),
            emi_amount: emiAmount.toFixed(2) // Adding EMI amount to the response
        });
    } catch (error) {
        console.error('Error retrieving payment schedule:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};



// Endpoint to add payment schedule
const addPaymentSchedule = async (req, res) => {
    const { userId, totalInstallments, startDate, Total_Amt } = req.body;

    if (req.user.role !== "admin") {
        return res.status(401).json({ error: "Unauthorized" });
    }
  
    try {
        const paymentSchedule = await paymentScheduleModel.addPaymentSchedule(userId, totalInstallments, startDate, Total_Amt);

        await paymentScheduleModel.updateUserSubscriptionToActive(userId);
        
        res.status(201).json(paymentSchedule);
    } catch (error) {
        console.error('Error adding payment schedule:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Endpoint to add payment
const addPayment = async (req, res) => {
    const { userId, amount, paymentDate } = req.body;

    if (req.user.role !== "admin") {
        return res.status(401).json({ error: "Unauthorized" });
    }
  
    try {
        const payment = await paymentScheduleModel.addPayment(userId, amount, paymentDate);
        res.status(201).json(payment);
    } catch (error) {
        console.error('Error adding payment:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getAllUserPaymentSchedule = async (req, res) => {

    if (req.user.role !== "admin") {
        return res.status(401).json({ error: "Unauthorized" });
    }

  try {
    const schedules = await paymentScheduleModel.getAllUserPaymentSchedules();

    const formattedSchedules = schedules.map(schedule => ({
      userId: schedule.user_id,
      username: schedule.username,
      batch_id: schedule.batch_id,
      totalInstallments: schedule.total_installments,
      startDate: new Date(schedule.start_date).toDateString(),
      payments: schedule.payments.map(payment => ({
        paymentDate: new Date(payment.payment_date).toDateString(),
        amount: payment.amount
      }))
    }));

    res.json(formattedSchedules);
  } catch (error) {
    console.error('Error retrieving all user payment schedules:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


const getToSchedule = async (req, res) => {
    
    if (req.user.role !== "admin") {
        return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const response = await paymentScheduleModel.ListUnscheduled();
  
      res.json(response);
    } catch (error) {
      console.error('Error retrieving all user tobe schedule:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

module.exports = {
    getPaymentSchedule,
    addPaymentSchedule,
    addPayment,
    getAllUserPaymentSchedule,
    getToSchedule,
};
