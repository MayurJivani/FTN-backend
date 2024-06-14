const lecturesModel = require('../models/lecturesModel');

const scheduleLecture = async (req, res) => {
    const { title, description, datetime, batch_id } = req.body;
    const username = req.user.username;

    try {
        if (req.user.role !== "mentor") {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const { sessionName, sessionPass } = generateCredentials(title);
        const credentials = encodeCredentialsToBase64(sessionName, sessionPass);
        const response = await lecturesModel.insertLecture(title, description, datetime, username, credentials, batch_id);

        res.status(201).json(response);
    } catch (error) {
        console.error('Error adding lecture schedule:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const generateCredentials = (sname) => {

    const sessionPass = Math.floor(100000 + Math.random() * 900000); // 6-digit random number

    const sessionName = sname.replace(/\s+/g, '_').toLowerCase();

    return { sessionName, sessionPass };
};

const encodeCredentialsToBase64 = (sessionName, sessionPass) => {
    const credentials = `${sessionName}:${sessionPass}`;
    return Buffer.from(credentials).toString('base64');
};

const listLecturesFromToday = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    try {
        const lectures = await lecturesModel.getLecturesFromToday(page, limit);
        res.status(200).json(lectures);
    } catch (error) {
        console.error('Error fetching lectures from today:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const listLecturesForToday = async (req, res) => {
    const batchId = req.user.batch_id;
    try {
        const lectures = await lecturesModel.getLecturesForToday(batchId);
        res.status(200).json(lectures);
    } catch (error) {
        console.error('Error fetching lectures for today:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    scheduleLecture,
    listLecturesFromToday,
    listLecturesForToday,
};