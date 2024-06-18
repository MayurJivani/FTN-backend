const pool = require('../config/database');

const getAllRecLectures = async () => {
    try {
        const lectures = await pool.query('SELECT * FROM rec_lectures');
        return lectures.rows;
    } catch (error) {
        throw new Error('Error fetching recorded lectures');
    }
};

const getBatchWiseRecLectures = async (batch_id) => {
    try {
        const query = 'SELECT * FROM rec_lectures WHERE $1 = ANY(batch_ids)';
        const values = [batch_id];
        const lectures = await pool.query(query, values);
        return lectures.rows;
    } catch (error) {
        throw new Error('Error fetching recorded lectures');
    }
};

module.exports = {
    getAllRecLectures,
    getBatchWiseRecLectures
};
