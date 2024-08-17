// attendanceModel.js
const pool = require('../config/database');

const getAttendanceBySessionId = async (sessionId) => {
  const query = 'SELECT attendance FROM attendance WHERE sessionid = $1';
  const result = await pool.query(query, [sessionId]);
  return result.rows[0]?.attendance || { users: [] };
};

const upsertAttendance = async (sessionName, sessionId, attendance) => {
  const existingAttendance = await getAttendanceBySessionId(sessionId);

  const newAttendance = {
    ...existingAttendance,
    sessionName,
    users: [
      ...existingAttendance.users.filter(user => user.user_name !== attendance.user_name),
      attendance
    ]
  };

  const query = `
    INSERT INTO attendance (sessionname, sessionid, attendance)
    VALUES ($1, $2, $3)
    ON CONFLICT (sessionid)
    DO UPDATE SET
      sessionname = EXCLUDED.sessionname,
      attendance = EXCLUDED.attendance
  `;
  
  await pool.query(query, [
    sessionName,
    sessionId,
    newAttendance
  ]);
};

module.exports = {
  getAttendanceBySessionId,
  upsertAttendance,
};
