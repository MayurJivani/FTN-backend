
const pool = require('../config/database');

const insertFeedback = async (user_id, response) => {
  const query = `
    INSERT INTO feedback (user_id, responses)
    VALUES ($1, $2)
    RETURNING *;
  `;
  const values = [user_id, response];
  const result = await pool.query(query, values);
  return result.rows[0];
};

module.exports = {
  insertFeedback,
};
