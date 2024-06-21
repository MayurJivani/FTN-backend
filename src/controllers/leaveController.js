const leaveModel = require('../models/leaveModel');
const { logger } = require('../utils/logger');
const sendEmail = require('../utils/sendEmail');

const applyLeave = async (req, res) => {
    const user_id = req.user.id;
    const username = req.user.username;
    const batch_id = req.user.batch_id;
    const email = req.user.email; 
    const { leaveType, approver, startDate, endDate, reason} = req.body;

    if (!user_id || !username || !leaveType || !approver || !startDate || !endDate || !reason || !batch_id || !email) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const leaveApplication = await leaveModel.insertLeaveApplication(user_id, username, leaveType, approver, startDate, endDate, reason, batch_id, email);
        res.status(201).json(leaveApplication);
    } catch (error) {
        logger.error('Error applying leave:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};



const listLeavesByBatch = async (req, res) => {
    const approver = req.query.approver;

    if (req.user.role !== "mentor") {
        return res.status(401).json({ error: "Unauthorized" });
    }

    try {
        let leaves;
        if (approver) {
            leaves = await leaveModel.getLeavesByApprover(approver);
        } else {
            leaves = await leaveModel.getAllLeaves();
        }

        res.status(200).json(leaves);
    } catch (error) {
        console.error('Error fetching leaves:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const approveOrDenyLeave = async (req, res) => {

    const { user_id, status } = req.body;

    if (req.user.role !== "mentor") {
        return res.status(401).json({ error: "Unauthorized" });
    }

    if (!user_id || !status || !['approved', 'denied'].includes(status)) {
        return res.status(400).json({ message: 'Valid user_id and status (approved or denied) are required' });
    }

    try {
        const leaveApplication = await leaveModel.updateLeaveStatus(user_id, status);

        const { username, leave_type, start_date, end_date, reason, email } = leaveApplication;
        
        const emailSubject = `Leave Application ${status.charAt(0).toUpperCase() + status.slice(1)}`;
        const emailBody = `
            <p>Hello ${username},</p>
            <p>Your leave application for ${leave_type} from ${new Date(start_date).toLocaleDateString()} to ${new Date(end_date).toLocaleDateString()} has been ${status}.</p>
            <p>Reason: ${reason}</p>
        `;

        await sendEmail(email, username, emailSubject, emailBody);

        res.status(200).json({ message: "Leave updated successfully" });
    } catch (error) {   
        console.error('Error updating leave status:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    applyLeave,
    listLeavesByBatch,
    approveOrDenyLeave,
};