const jwt = require('jsonwebtoken');
require('dotenv').config();
const ZoomModel = require('../models/zoomSdkModel');

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

const handleRecording = async (req, res) => {
  const { sessionName, method } = req.body;
  const token = generateZoomApiJWT();
  
  try {
    const sessions = await ZoomModel.getSessions(token);
    const session = sessions.sessions.find(s => s.session_name === sessionName);

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const sessionId = session.id;
    const response = await ZoomModel.controlRecording(sessionId, token, method);

    res.status(200).json(response);
  } catch (error) {
    if (error.response && error.response.data) {
      // Handle known errors from the Zoom API
      return res.status(error.response.status).json({ error: error.response.data.message });
    }
    // Handle unexpected errors
    res.status(500).json({ error: 'Failed to control session recordings' });
  }
};

const fetchRecordings = async (req, res) => {
  const { token } = req.body;
  try {
      const response = await ZoomModel.getRecordings(token);
      res.status(200).json(response);
  } catch (error) {
      res.status(500).json({ error: 'Failed to get session recordings' });
  }
};

module.exports = {
  generateSessionJWT,
  handleRecording,
  fetchRecordings,
  generateZoomApiJWT,
  generateZoomApiTk,
};
