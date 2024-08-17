const pool = require('../config/database');

const getUserById = async (userId) => {
  try {
    const query = 'SELECT email, batch_id, username FROM users WHERE user_id = $1';
    const values = [userId];
    const { rows } = await pool.query(query, values);
    return rows[0];
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    throw error;
  }
};

module.exports = {
  getUserById,
};
