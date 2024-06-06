const awsBucket = require('../models/awsBucket');
const fs = require('fs');
const path = require('path');

const fileUpload = async (req, res) => {
    try {
       
      const sessionId = req.params.sessionId; 
      
      await awsBucket.createSubBucket(sessionId);
  
      const fileUrl = await awsBucket.uploadFile(sessionId, req.file);
  
      res.status(200).json({ url: fileUrl });
    } catch (error) {
      console.error('Error uploading file:', error);
      res.status(500).json({ error: 'Failed to upload file' });
    }
};

const listFiles = async (req, res) => {
  const directoryPath = path.join(__dirname, '../docs');

  try {

    const files = await fs.promises.readdir(directoryPath);

    res.json({ "Python": { Lecture_Notes: files } });
  } catch (error) {

    console.error('Error listing files:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const downloadFile = async (req, res) => {
  const fileName = req.params.fileName;
  const filePath = path.join(__dirname, '../docs', fileName);

  try {
    // Check if the file exists
    await fs.promises.access(filePath, fs.constants.F_OK);

    // Stream the file to the response
    const fileStream = fs.createReadStream(filePath);
    fileStream.on('error', (error) => {
      console.error('Error reading file:', error);
      res.status(500).json({ error: 'Internal server error' });
    });

    fileStream.pipe(res);
  } catch (error) {
    if (error.code === 'ENOENT') {
      res.status(404).json({ error: 'File not found' });
    } else {
      console.error('Error downloading file:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

module.exports = {
    fileUpload,
    listFiles,
    downloadFile,
  };