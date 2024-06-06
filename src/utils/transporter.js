const nodemailer = require('nodemailer');
const { host, port, secure, auth } = require('../config/emailConfig');

const transporter = nodemailer.createTransport({
  host: host,
  port: port,
  secure: secure,
  auth: auth,
});

module.exports = transporter;
