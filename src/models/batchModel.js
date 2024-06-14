const pool = require('../config/database');

const getAllBatches = async () => {
  try {
    const result = await pool.query('SELECT * FROM batch');
    return result.rows;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getAllBatches,
};
