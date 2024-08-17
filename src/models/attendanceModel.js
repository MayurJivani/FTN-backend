const pool = require('../config/database');

const getAttendanceBySessionId = async (sessionId) => {
  const query = 'SELECT attendance FROM attendance WHERE sessionid = $1';
  const result = await pool.query(query, [sessionId]);
  return result.rows[0]?.attendance || { users: [] };
};

const upsertAttendance = async (sessionName, sessionId, attendance) => {
  const existingAttendance = await getAttendanceBySessionId(sessionId);

  // Prepare the updated attendance data
  const updatedUsers = existingAttendance.users.map(user => {
    if (user.user_name === attendance.user_name) {
      // Update leave time only, preserve join time
      return {
        ...user,
        leave_time: attendance.leave_time
      };
    }
    return user;
  });

  // If user is not in existing attendance, add them
  if (!updatedUsers.some(user => user.user_name === attendance.user_name)) {
    updatedUsers.push({
      user_name: attendance.user_name,
      join_time: attendance.join_time,
      leave_time: attendance.leave_time
    });
  }

  const newAttendance = {
    ...existingAttendance,
    sessionName,
    users: updatedUsers
  };

  const query = `
    INSERT INTO attendance (sessionname, sessionid, attendance)
    VALUES ($1, $2, $3)
    ON CONFLICT (sessionid)
    DO UPDATE SET
      sessionname = EXCLUDED.sessionname,
      attendance = EXCLUDED.attendance
  `;

  await pool.query(query, [sessionName, sessionId, newAttendance]);
};

/**
 * Retrieves all attendance data from the database.
 * @returns {Array} - All attendance records.
 */
const getAllAttendanceFromDB = async () => {
  const query = 'SELECT * FROM attendance';
  const result = await pool.query(query);
  return result.rows;
};

module.exports = {
  getAttendanceBySessionId,
  upsertAttendance,
  getAllAttendanceFromDB
};
