const pool = require('../config/database');

const getAllRecLectures = async () => {
    try {
        const lectures = await pool.query('SELECT * FROM recordings');
        return lectures.rows;
    } catch (error) {
        throw new Error('Error fetching recorded lectures');
    }
};

const getBatchWiseRecLectures = async (batch_id) => {
    try {
        const query = 'SELECT * FROM recordings WHERE $1 = ANY(batch_ids) ORDER BY date';
        const values = [batch_id];
        const lectures = await pool.query(query, values);
        return lectures.rows;
    } catch (error) {
        throw new Error('Error fetching recorded lectures');
    }
};

const convertDurationToInterval = (duration) => {
    const [hours, minutes, seconds] = duration.split(':').map(Number);
    return `${hours} hours ${minutes} minutes ${seconds} seconds`;
};
  
const insertRecLecture = async (lecture) => {
    const { duration, date, batch_ids, type, name, url, description, sessionid } = lecture;
    const intervalDuration = convertDurationToInterval(duration); // Convert duration to interval format if necessary
    const query = `
      INSERT INTO recordings (duration, date, batch_ids, type, name, url, description, sessionid)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;
    `;
    const values = [intervalDuration, date, batch_ids, type, name, url, description, sessionid];
  
    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Database Error:', error); // Log the detailed error
      throw new Error('Error inserting recorded lecture');
    }
};
  

const getRecordingsBetween = async (from, to) => {
    const query = `
        SELECT * FROM recordings 
        WHERE date BETWEEN $1 AND $2;
    `;
    const values = [from, to];

    try {
        const result = await pool.query(query, values);
        return result.rows;
    } catch (error) {
        throw new Error('Error fetching recordings between dates');
    }
};

module.exports = {
    getAllRecLectures,
    getBatchWiseRecLectures,
    insertRecLecture,
    getRecordingsBetween 
};
