module.exports = {
    host: process.env.MAIL_HOST, 
    port: 587, 
    secure: false,
    auth: {
      user: process.env.MAIL_USER , 
      pass: process.env.MAIL_PASS, 
    },
  };
  