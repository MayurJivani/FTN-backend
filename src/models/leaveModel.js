const pool = require('../config/database');

const insertLeaveApplication = async (userId, username, leaveType, approver, startDate, endDate, reason, batchId, email) => {
    const query = `
        INSERT INTO leaves (user_id, username, leave_type, approver, start_date, end_date, reason, batch_id, status, email)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'pending', $9)
        RETURNING *;
    `;
    const start_date_utc = new Date(startDate).toISOString();
    const end_date_utc = new Date(endDate).toISOString();
    const values = [userId, username, leaveType, approver, start_date_utc, end_date_utc, reason, batchId, email];
    const result = await pool.query(query, values);
    return result.rows[0];
};

const getAllLeaves = async () => {
    const query = `SELECT * FROM leaves;`;
    const result = await pool.query(query);
    return result.rows;
};

const getLeavesByApprover = async (approverId) => {
    const query = `SELECT * FROM leaves WHERE approver = $1;`;
    const values = [approverId];
    const result = await pool.query(query, values);
    return result.rows;
};

const updateLeaveStatus = async (leaveId, status) => {
    const query = `
        UPDATE leaves
        SET status = $1
        WHERE id = $2
        RETURNING *;
    `;
    const values = [status, leaveId];
    const result = await pool.query(query, values);
    return result.rows[0];
};

module.exports = {
    insertLeaveApplication,
    getAllLeaves,
    getLeavesByApprover,
    updateLeaveStatus,
};
