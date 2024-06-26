const transporter = require('./transporter');

const sendEmail = async (to, username, subject, htmlBody) => {
  try {
    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: to,
      subject: subject,
      html: htmlBody.replace('{username}', username),
    });
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = sendEmail;
