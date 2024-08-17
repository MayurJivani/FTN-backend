const { getAllAttendanceFromDB } = require('../models/attendanceModel');

const getAllAttendance = async (req, res) => {

  if (req.user.role !== 'admin') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const attendanceData = await getAllAttendanceFromDB();
    const formattedData = attendanceData.map(record => ({
      sessionName: record.sessionname,
      sessionTimestamp: record.created_at,
      attendance: record.attendance.users,
    }));
    res.status(200).json(formattedData);
  } catch (error) {
    console.error('Error fetching attendance data:', error);
    res.status(500).json({ error: 'Failed to fetch attendance data' });
  }
};

module.exports = {
  getAllAttendance,
};
