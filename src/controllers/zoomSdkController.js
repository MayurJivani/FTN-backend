const jwt = require('jsonwebtoken');
require('dotenv').config();

const ZOOM_SDK_KEY = process.env.ZOOM_SDK_KEY;
const ZOOM_SDK_SECRET = process.env.ZOOM_SDK_SECRET;

const generateSessionJWT = (req, res) => {
  const payload = {
    app_key: ZOOM_SDK_KEY,
    role_type: req.body.role,  // 1 for host, 0 for participant
    tpc: req.body.sessionName,  // Your session name
    version: 1,
    iat: Math.floor(Date.now() / 1000),  // Current time in seconds
    exp: Math.floor(Date.now() / 1000) + 1800,  // Expiry time (30 minutes from now)
    user_identity: req.user.username,  // Optional: user identity
  };

  const token = jwt.sign(payload, ZOOM_SDK_SECRET, { algorithm: 'HS256' });
  res.json({ signature: token });
};


module.exports = {
  generateSessionJWT,
};
