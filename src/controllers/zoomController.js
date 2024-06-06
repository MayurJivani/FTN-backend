// zoomController.js

const axios = require('axios');
require('dotenv').config();

const ZOOM_CLIENT_ID = process.env.ZOOM_CLIENT_ID;
const ZOOM_CLIENT_SECRET = process.env.ZOOM_CLIENT_SECRET;
const ZOOM_REDIRECT_URI = process.env.ZOOM_REDIRECT_URI;


const generateAuthUrl = (req, res) => {
  const scopes = 'user:read:user:admin';
  const redirectUrl = `https://zoom.us/oauth/authorize?client_id=b9wS3nbURkOwpNqTqunWdw&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A5000%2Fapi%2Fzoom%2Ftoken`;
  res.redirect(redirectUrl);
};

const exchangeToken = async (req, res) => {
  
    const { code } = req.query;
    console.log(code)
    try {
      const authHeader = `Basic ${Buffer.from(`${ZOOM_CLIENT_ID}:${ZOOM_CLIENT_SECRET}`).toString('base64')}`;
      const tokenParams = new URLSearchParams();
      tokenParams.append('code', code);
      tokenParams.append('grant_type', 'authorization_code');
      tokenParams.append('redirect_uri', ZOOM_REDIRECT_URI);
  
      const zoomTokenResponse = await axios.post(
        'https://zoom.us/oauth/token',
        tokenParams,
        {
          headers: {
            'Authorization': authHeader,
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );
  
      const zoomTokenData = zoomTokenResponse.data;
      if (zoomTokenResponse.status !== 200) {
        console.error('Error exchanging authorization code for access token:', zoomTokenData);
        return res.status(401).json({ message: 'Invalid Zoom authorization code' });
      }
  
      res.json({ accessToken: zoomTokenData.access_token });
    } catch (error) {
      console.error('Error exchanging authorization code for access token:', error);
      res.status(500).json({ message: 'Server Error' });
    }
    // try {
    //   const authHeader = `Basic ${Buffer.from(`${ZOOM_CLIENT_ID}:${ZOOM_CLIENT_SECRET}`).toString('base64')}`;
  
    //   const zoomTokenResponse = await axios.post('https://zoom.us/oauth/token', 
    //     `code=${code}&grant_type=authorization_code&redirect_uri=${encodeURIComponent("http://localhost:5000/api/zoom/tokens")}`, 
    //     {
    //       headers: {
    //         'Authorization': authHeader,
    //         'Content-Type': 'application/x-www-form-urlencoded'
    //       }
    //     });
  
    //   const zoomTokenData = zoomTokenResponse.data;
  
    //   if (zoomTokenResponse.status !== 200) {
    //     console.error('Error exchanging authorization code for access token:', zoomTokenData);
    //     return res.status(401).json({ message: 'Invalid Zoom authorization code' });
    //   }
  
    //   res.json({ accessToken: zoomTokenData.access_token });
    // } catch (error) {
    //   console.error('Error exchanging authorization code for access token:', error);
    //   res.status(500).json({ message: 'Server Error' });
    // }
};

const handleTokenCallback = async (req, res) => {
    
    res.redirect('/success');
};

module.exports = {
  generateAuthUrl,
  exchangeToken,
  handleTokenCallback,
};
