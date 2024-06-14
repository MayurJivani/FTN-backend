const pool = require('../config/database');

const insertLecture = async (title, description, datetime, scheduleBy, credentials, batch_id) => {
    const query = `
        INSERT INTO lectures (title, description, datetime, scheduleBy, credentials, batch_id)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;
    `;
    const values = [title, description, datetime, scheduleBy, credentials, batch_id];
    const result = await pool.query(query, values);
    return result.rows[0];
};

const getLecturesFromToday = async (page = 1, limit = 10) => {
    const offset = (page - 1) * limit;
    const query = `
        SELECT * FROM lectures
        WHERE datetime >= CURRENT_DATE
        ORDER BY datetime ASC
        LIMIT $1 OFFSET $2;
    `;
    const values = [limit, offset];
    const result = await pool.query(query, values);
    return result.rows;
};

const getLecturesForToday = async (batchId) => {
    const query = `
      SELECT * FROM lectures
      WHERE DATE(datetime) = CURRENT_DATE AND batch_id = $1
      ORDER BY datetime ASC;
    `;
    const values = [batchId];
    const result = await pool.query(query, values);
    return result.rows;
  };
  

module.exports = {
    insertLecture,
    getLecturesFromToday,
    getLecturesForToday,
};