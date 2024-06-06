const pool = require('../config/database');

const getPaymentScheduleByUserId = async (userId) => {
  try {
    const query = 'SELECT * FROM payment_schedule WHERE user_id = $1';
    const { rows } = await pool.query(query, [userId]);
    return rows[0];
  } catch (error) {
    throw error;
  }
};

const getPaymentsByUserId = async (userId) => {
  try {
    const query = 'SELECT * FROM payments WHERE user_id = $1 ORDER BY payment_date ASC';
    const { rows } = await pool.query(query, [userId]);
    return rows;
  } catch (error) {
    throw error;
  }
};

const addPaymentSchedule = async (userId, totalInstallments, startDate) => {
    const query = 'INSERT INTO payment_schedule (user_id, total_installments, start_date) VALUES ($1, $2, $3) RETURNING *';
    const values = [userId, totalInstallments, startDate];
    const { rows } = await pool.query(query, values);
    return rows[0];
};
  
const addPayment = async (userId, amount, paymentDate) => {
    const query = 'INSERT INTO payments (user_id, amount, payment_date) VALUES ($1, $2, $3) RETURNING *';
    const values = [userId, amount, paymentDate];
    const { rows } = await pool.query(query, values);
    return rows[0];
};
  
module.exports = {
    getPaymentScheduleByUserId,
    getPaymentsByUserId,
    addPaymentSchedule,
    addPayment,
};


