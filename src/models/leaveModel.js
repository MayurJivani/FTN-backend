const pool = require('../config/database');

const insertLeaveApplication = async (userId, leaveType, approver, startDate, endDate, reason) => {
    const query = `
        INSERT INTO leaves (user_id, leave_type, approver, start_date, end_date, reason)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;
    `;
    const values = [userId, leaveType, approver, startDate, endDate, reason];
    const result = await pool.query(query, values);
    return result.rows[0];
};

module.exports = {
    insertLeaveApplication,
};
