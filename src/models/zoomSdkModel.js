const axios = require('axios');

const ZoomModel = {
  async getSessions(token) {
    const url = `https://api.zoom.us/v2/videosdk/sessions`;
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    try {
      const response = await axios.get(url, { headers });
      return response.data;
    } catch (error) {
      console.error('Error fetching sessions:', error.response ? error.response.data : error.message);
      throw error;
    }
  },

  async controlRecording(sessionId, token, method) {
    const encodedSessionId = encodeURIComponent(sessionId);
    console.log(encodedSessionId)
    const url = `https://api.zoom.us/v2/videosdk/sessions/${encodedSessionId}/events`;
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
    const body = {
      method: method === 'start' ? 'recording.start' : 'recording.stop'
    };

    try {
      const response = await axios.patch(url, body, { headers });
      return response.data;
    } catch (error) {
      console.error(`Error ${method === 'start' ? 'starting' : 'stopping'} recording:`, error.response ? error.response.data : error.message);
      throw error;
    }
  }
  
};

module.exports = ZoomModel;
