const pool = require('../config/database');

const insertLecture = async (title, description, datetime, scheduleBy, credentials) => {
    const query = `
        INSERT INTO lectures (title, description, datetime, scheduleBy, credentials)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
    `;
    const values = [title, description, datetime, scheduleBy, credentials];
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

const getLecturesForToday = async () => {
    const query = `
        SELECT * FROM lectures
        WHERE DATE(datetime) = CURRENT_DATE
        ORDER BY datetime ASC;
    `;
    const result = await pool.query(query);
    return result.rows;
};

module.exports = {
    insertLecture,
    getLecturesFromToday,
    getLecturesForToday,
};