const transporter = require('./transporter');

const sendEmail = async (to, username) => {
  try {
    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: to,
      subject: `Successful Registraion`,
      html: `<p>Hello ${username},</p><p>You have successfully registered in Fly the Nest.</p>`,
    });
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = sendEmail;
