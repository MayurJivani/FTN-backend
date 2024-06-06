const pool = require('../config/database');

const getAllRecLectures = async () => {
    try {
        const lectures = await pool.query('SELECT * FROM rec_lectures');
        return lectures.rows;
    } catch (error) {
        throw new Error('Error fetching recorded lectures');
    }
};

module.exports = {
    getAllRecLectures
};
