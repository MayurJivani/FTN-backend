const jwt = require('jsonwebtoken');
require('dotenv').config();
const ZoomModel = require('../models/zoomSdkModel');
const {upsertAttendance} = require('../models/attendanceModel');
const recLectureModel = require('../models/recLecturesModel');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { Upload } = require('@aws-sdk/lib-storage');
const { logger } = require('../utils/logger');

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const ZOOM_SDK_KEY = process.env.ZOOM_SDK_KEY;
const ZOOM_SDK_SECRET = process.env.ZOOM_SDK_SECRET;
const VIDEO_SDK_API_KEY = process.env.VIDEO_SDK_API_KEY;
const VIDEO_SDK_API_SECRET = process.env.VIDEO_SDK_API_SECRET;

const generateSessionJWT = (req, res) => {
  const payload = {
    app_key: ZOOM_SDK_KEY,
    role_type: req.body.role,  
    tpc: req.body.sessionName,  
    version: 1,
    iat: Math.floor(Date.now() / 1000),  
    exp: Math.floor(Date.now() / 1000) + 43200, 
    user_identity: req.user.username, 
    cloud_recording_option: 1, 
    cloud_recording_election: 1,
  };

  const token = jwt.sign(payload, ZOOM_SDK_SECRET, { algorithm: 'HS256' });
  res.json({ signature: token });
};

const generateZoomApiJWT = () => {
  const payload = {
    iss: VIDEO_SDK_API_KEY,
    iat: Math.floor(Date.now() / 1000),  
    exp: Math.floor(Date.now() / 1000) + 43200, 
  };

  const token = jwt.sign(payload, VIDEO_SDK_API_SECRET, { algorithm: 'HS256' });
  return token;
};

const generateZoomApiTk = async(req, res) => {
  const payload = {
    iss: VIDEO_SDK_API_KEY,
    iat: Math.floor(Date.now() / 1000),  
    exp: Math.floor(Date.now() / 1000) + 43200, 
  };

  const token = jwt.sign(payload, VIDEO_SDK_API_SECRET, { algorithm: 'HS256' });
  res.status(200).json(token);
};

const fetchRecordings = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = generateZoomApiJWT();
  const { from, to } = req.body;

  try {
    const response = await ZoomModel.getRecordings(token, from, to);
    const dbRecordings = await recLectureModel.getRecordingsBetween(from, to);

    const filteredSessions = response.sessions.map(session => {
      const filteredRecordingFiles = session.recording_files.filter(file => {
        const startTime = new Date(file.recording_start);
        const endTime = new Date(file.recording_end);
        const recordingDuration = (endTime - startTime) / 60000; // Convert milliseconds to minutes

        return file.file_type === 'MP4' && recordingDuration >= 10;
      });

      if (filteredRecordingFiles.length > 0) {
        const dbRecording = dbRecordings.find(dbRec => dbRec.sessionid === session.session_id);

        return {
          session_id: session.session_id,
          session_name: session.session_name,
          recording_status: dbRecording ? 'uploaded' : 'not_uploaded',
          recording_files: filteredRecordingFiles.map(file => {
            const startTime = new Date(file.recording_start);
            const endTime = new Date(file.recording_end);
            const recordingDuration = ((endTime - startTime) / 60000).toFixed(0);

            return {
              id: file.id,
              status: file.status,
              recording_start: file.recording_start,
              recording_end: file.recording_end,
              recording_duration: parseFloat(recordingDuration),
            };
          }),
        };
      }

      return null;
    }).filter(session => session !== null);

    res.status(200).json({
      from,
      to,
      sessions: filteredSessions,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get session recordings' });
  }
};

const uploadRecording = async (req, res) => {

  if (req.user.role !== 'admin') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { sessionId, recordingId, bucketName, duration, date, batch_ids, type } = req.body
  const mainBucket = 'fly-the-nest';

  try {
    const token = generateZoomApiJWT();
    const response = await ZoomModel.getSessionRecordings(sessionId, token);
    const recording = response.recording_files.find((file) => file.file_type === 'MP4');
    if (!recording) {
      return res.status(404).json({ error: 'Recording not found' });
    }

    const sessionName = response.session_name;

    let recordingName = sessionName.replace(/_/, '');
    const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    recordingName = recordingName.split('_').map(capitalizeFirstLetter).join('');
    
    const recordingStart = new Date(recording.recording_start);

    const istOffset = 5.5 * 60 * 60 * 1000;
    const istTime = new Date(recordingStart.getTime() + istOffset);
    const formattedTime = istTime.toISOString().replace(/T/, '-').replace(/\..+/, '').replace(/:/g, '-');

    const fileName = `${sessionName}-${formattedTime}.mp4`;

    const recordingUrl = `${recording.download_url}?access_token=${token}`;
    const filePath = path.join(__dirname, '../upload', fileName);
      
    const responseStream = await axios({
      url: recordingUrl,
      method: 'GET',
      responseType: 'stream',
    });

    const writer = fs.createWriteStream(filePath);
    
    responseStream.data.pipe(writer);

    writer.on('finish', async () => {
      try {
        const fileStream = fs.createReadStream(filePath);

        const s3Key = `${bucketName}/${fileName}`;
        const uploadParams = {
          Bucket: mainBucket,
          Key: s3Key,
          Body: fileStream,
          ACL: 'public-read',
        };

        const upload = new Upload({
          client: s3Client,
          params: uploadParams,
        });

        await upload.done();

        fs.unlinkSync(filePath);
          
        const lecture = {
          duration,
          date,
          batch_ids,
          type,
          name: recordingName,
          url: s3Key,
          description: '',
          sessionid: sessionId,
        };

        try {
          await recLectureModel.insertRecLecture(lecture);
          res.status(200).json({ message: 'Recording downloaded, uploaded, and recorded successfully' });
        } catch (insertError) {
          console.error('Error inserting lecture:', insertError);
          res.status(500).json({ error: 'Failed to record lecture in database' });
        }
        
      } catch (uploadError) {
        res.status(500).json({ error: 'Failed to upload recording to S3' });
      }
    });

    writer.on('error', (error) => res.status(500).json({ error: 'Failed to download recording' }));
  } catch (error) {
    res.status(500).json({ error: 'Failed to download recording' });
  }
};


const eventsWebhook = async (req, res) => {
  const eventType = req.body.event;

  if (eventType === 'endpoint.url_validation') {
    const { plainToken } = req.body.payload;
    const encryptedToken = crypto.createHmac('sha256', process.env.VIDEO_SDK_EVENT_SECRET)
                                 .update(plainToken)
                                 .digest('hex');
    return res.json({ encryptedToken });
  }

  if (eventType === 'session.recording_completed') {
    logger.info('Recording completed:', req.body.payload);
    return res.status(200).send('Webhook processed successfully');
  }

  if (eventType === 'session.user_joined' || eventType === 'session.user_left') {
    const { session_id, user, session_name } = req.body.payload.object;

    if (!user) {
      logger.error('User data is missing in the payload');
      return res.status(400).send('Invalid event data');
    }

    const { name, leave_time } = user;
    const join_time = eventType === 'session.user_joined' ? new Date().toISOString() : null;

    try {
      await upsertAttendance(session_name, session_id, {
        user_name: name,
        join_time,
        leave_time
      });
      return res.status(200).send('Webhook processed successfully');
    } catch (error) {
      logger.error('Error processing webhook:', error);
      return res.status(500).send('Internal Server Error');
    }
  }

  return res.status(400).send('Unsupported event');
};


module.exports = {
  generateSessionJWT,
  fetchRecordings,
  generateZoomApiJWT,
  generateZoomApiTk,
  uploadRecording,
  eventsWebhook,
};
