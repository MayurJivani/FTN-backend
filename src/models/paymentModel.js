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

const getAllUserPaymentSchedules = async () => {
  try {
    const scheduleQuery = `
      SELECT ps.user_id, u.username, ps.total_installments, ps.start_date, 
             json_agg(json_build_object('payment_date', p.payment_date, 'amount', p.amount)) AS payments
      FROM payment_schedule ps
      JOIN users u ON ps.user_id = u.user_id
      LEFT JOIN payments p ON ps.user_id = p.user_id
      GROUP BY ps.user_id, u.username, ps.total_installments, ps.start_date
      ORDER BY ps.user_id;
    `;
    const { rows } = await pool.query(scheduleQuery);
    return rows;
  } catch (error) {
    throw error;
  }
};

const updateUserSubscriptionToActive = async (userId) => {
  const query = 'UPDATE users SET subscription = $1 WHERE user_id = $2';
  const values = ['active', userId];
  await pool.query(query, values);
};
  
module.exports = {
    getAllUserPaymentSchedules,
    updateUserSubscriptionToActive,
    getPaymentScheduleByUserId,
    getPaymentsByUserId,
    addPaymentSchedule,
    addPayment,
};


