const { insertLeaveApplication } = require('../models/leaveModel');

const applyLeave = async (req, res) => {
    const user_id = req.user.id;
    const { leaveType, approver, startDate, endDate, reason } = req.body;

    if (!user_id || !leaveType || !approver || !startDate || !endDate || !reason) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const leaveApplication = await insertLeaveApplication(user_id, leaveType, approver, startDate, endDate, reason);
        res.status(201).json(leaveApplication);
    } catch (error) {
        console.error('Error applying leave:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    applyLeave,
};
