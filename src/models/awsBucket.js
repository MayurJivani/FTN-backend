const { S3Client,PutObjectCommand } = require("@aws-sdk/client-s3");
const { Readable } = require('stream');
const { Upload } = require("@aws-sdk/lib-storage");

const s3 = new S3Client({
  region: 'ap-south-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

const createSubBucket = async (sessionId) => {
  const params = {
    Bucket: 'internal-data-1',
    Key: `FTN-app/Upload/${sessionId}/`
  };

  try {
    await s3.send(new PutObjectCommand(params));
    console.log(`Sub-bucket '/FTN-app/Upload/${sessionId}/' created successfully`);
  } catch (error) {
    throw error;
  }
};

const uploadFile = async (sessionId, file) => {
  const fileBuffer = Buffer.from(file.buffer);
  const fileStream = Readable.from(fileBuffer);

  const upload = new Upload({
    client: s3,
    params: {
      Bucket: 'internal-data-1',
      Key: `FTN-app/Upload/${sessionId}/${file.originalname}`,
      Body: fileStream,
      ContentType: file.mimetype
    }
  });

  try {
    const data = await upload.done();
    console.log(`File uploaded successfully: ${data.Location}`);
    return data.Location;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

module.exports = { createSubBucket, uploadFile };
