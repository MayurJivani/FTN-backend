const recLecturesModel = require('../models/recLecturesModel');


const getAllRecLectures = async (req, res) => {
    try {
        const lectures = await recLecturesModel.getAllRecLectures();
        
        const formattedLectures = lectures.map(lecture => ({
            [lecture.name]: {
                url: lecture.url,
                duration: lecture.duration,
                date: lecture.date,
                desc: lecture.description
            }
        }));
        
        

        res.json(formattedLectures);
    } catch (error) {
        console.error('Error fetching recorded lectures:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const getBatchWiseRecLectures = async (req, res) => {

    const batch_id = req.user.batch_id;

    try {
        const lectures = await recLecturesModel.getBatchWiseRecLectures(batch_id);
        
        const formattedLectures = lectures.map(lecture => ({
            [lecture.name]: {
                url: lecture.url,
                duration: lecture.duration,
                date: lecture.date,
                desc: lecture.description
            }
        }));
        
        

        res.json(formattedLectures);
    } catch (error) {
        console.error('Error fetching recorded lectures:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getAllRecLectures,
    getBatchWiseRecLectures
};
