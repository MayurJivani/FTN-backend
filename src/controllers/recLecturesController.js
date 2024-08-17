const recLecturesModel = require('../models/recLecturesModel');
const CLOUDFRONT_DISTRIBUTION_URL = process.env.CLOUDFRONT_DOMAIN;

const getAllRecLectures = async (req, res) => {
    try {
        const lectures = await recLecturesModel.getAllRecLectures();
        
        const formattedLectures = lectures.map(lecture => ({
            [lecture.name]: {
                url: lecture.url,
                duration: lecture.duration,
                date: lecture.date,
                desc: lecture.description,
                type: lecture.type
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
                desc: lecture.description,
                type: lecture.type
            }
        }));
        
        

        res.json(formattedLectures);
    } catch (error) {
        console.error('Error fetching recorded lectures:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const insertRecLecture = async (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(401).json({ error: "Unauthorized" });
    }
    const { duration, date, batch_ids, type, name, url, description } = req.body;
    try {
        const newLecture = await recLecturesModel.insertRecLecture({
            duration,
            date,
            batch_ids,
            type,
            name,
            url,
            description
        });
        res.status(201).json(newLecture);
    } catch (error) {
        console.error('Error inserting recorded lecture:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const getUrl = async (req, res) => {
    const fileName = req.body.fileName;

    if (!fileName) {
        return res.status(400).json({ error: 'fileName query parameter is required' });
    }

    try {
        // const signedUrl = s3.getSignedUrl('getObject', {
        //     Bucket: S3_BUCKET_NAME,
        //     Key: fileName,
        //     Expires: 30  
        // });

        const cloudfrontUrl = `${CLOUDFRONT_DISTRIBUTION_URL}/${fileName}`;
        
        res.json({ signedUrl:Buffer.from(cloudfrontUrl).toString('base64')  });
    } catch (error) {
        console.error('Error generating signed URL:', error);
        res.status(500).json({ error: 'Server Error' });
    }
};

module.exports = {
    getAllRecLectures,
    getBatchWiseRecLectures,
    insertRecLecture,
    getUrl
};

