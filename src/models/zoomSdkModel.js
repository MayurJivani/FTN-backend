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

  async getRecordings(token, fromDate, toDate) {
    const url = 'https://api.zoom.us/v2/videosdk/recordings';
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
    const params = {};

    if (fromDate && toDate) {
      params.from = fromDate;
      params.to = toDate;
    }

    try {
      const response = await axios.get(url, {
        headers,
        params,
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching recordings:', error.response ? error.response.data : error.message);
      throw error;
    }
  },

  async getSessionRecordings(sessionId, token) {
    const encodedSessionId = encodeURIComponent(encodeURIComponent(sessionId));
    const url = `https://api.zoom.us/v2/videosdk/sessions/${encodedSessionId}/recordings`;
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    try {
      const response = await axios.get(url, { headers });
      return response.data;
    } catch (error) {
      console.error('Error fetching session recordings:', error.response ? error.response.data : error.message);
      throw error;
    }
  }

};

module.exports = ZoomModel;
