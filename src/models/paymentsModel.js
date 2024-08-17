const pool = require('../config/database');

const insertPaymentSchedule = async (paymentData) => {
  const { UserId, Admission_date, Total_Fees, Total_EMI, Total_PDC, Schedule } = paymentData;

  const queryText = `
    INSERT INTO payment_schedules (UserId, Admission_date, Total_Fees, Total_EMI, Total_PDC, Schedule)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
  `;
  const values = [UserId, Admission_date, Total_Fees, Total_EMI, Total_PDC, Schedule];

  const client = await pool.connect();

  try {
    const result = await client.query(queryText, values);
    return result.rows[0];
  } finally {
    client.release();
  }
};

const getPaymentScheduleByUserId = async (userId) => {
  const queryText = 'SELECT * FROM payment_schedules WHERE UserId = $1';
  const values = [userId];

  const client = await pool.connect();

  try {
    const result = await client.query(queryText, values);
    return result.rows[0];
  } finally {
    client.release();
  }
};

const getAllPaymentSchedules = async () => {
  const queryText = 'SELECT * FROM payment_schedules';

  const client = await pool.connect();

  try {
    const result = await client.query(queryText);
    return result.rows;
  } finally {
    client.release();
  }
};

const getUsersWithoutSchedule = async () => {
  const queryText = `
    SELECT u.UserId, u.Name 
    FROM users u
    LEFT JOIN payment_schedules ps ON u.UserId = ps.UserId
    WHERE ps.UserId IS NULL
  `;

  const client = await pool.connect();

  try {
    const result = await client.query(queryText);
    return result.rows;
  } finally {
    client.release();
  }
};

const addPayment = async (userId, amount, paymentDate, paymentMethod, paymentType) => {
  const queryText = `
    INSERT INTO payments (userId, amount, paymentDate, paymentMethod, paymentType)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `;
  const values = [userId, amount, paymentDate, paymentMethod, paymentType];

  const client = await pool.connect();

  try {
    const result = await client.query(queryText, values);
    return result.rows[0];
  } finally {
    client.release();
  }
};

const updatePaymentSchedule = async (userId, schedule) => {
  const queryText = `
    UPDATE payment_schedule
    SET schedule = $1
    WHERE userId = $2
    RETURNING *;
  `;
  const values = [schedule, userId];

  const client = await pool.connect();

  try {
    const result = await client.query(queryText, values);
    return result.rows[0];
  } finally {
    client.release();
  }
};

module.exports = {
  getPaymentScheduleByUserId,
  getAllPaymentSchedules,
  getUsersWithoutSchedule,
  insertPaymentSchedule,
  addPayment,
  updatePaymentSchedule,
};
