const recLecturesModel = require('../models/recLecturesModel');


const getAllRecLectures = async (req, res) => {
    try {
        const lectures = await recLecturesModel.getAllRecLectures();
        
        const formattedLectures = lectures.map(lecture => ({
            [lecture.name]: {
                url: lecture.url,
                duration: lecture.duration,
                date: lecture.date
            }
        }));
        
        

        res.json(formattedLectures);
    } catch (error) {
        console.error('Error fetching recorded lectures:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getAllRecLectures
};
