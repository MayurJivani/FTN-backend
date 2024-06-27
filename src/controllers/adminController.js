const bcrypt = require('bcrypt');
const pool = require('../config/database');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { logger } = require('../utils/logger');


const loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  try {
    logger.info('User login', { Logging_User: req.body.email });
    const user = await pool.query('SELECT * FROM admins WHERE email = $1', [email]);
    if (user.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.rows[0].password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (user.rows[0].subscription !== 'active') {
      return res.status(403).json({ message: 'Please purchase course to access or Contact authorities' });
    }

    //console.log(typeof appId);

    // const zegoToken = generateToken04(
    //   appId, 
    //   user.rows[0].user_id, 
    //   secret, 
    //   86400, 
    // );

    const payload = {
      id: user.rows[0].id,
      email: user.rows[0].email,
      username: user.rows[0].username,
      role: "admin",
      //zegoToken: zegoToken,
    };    

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

    // const profilePic = user.rows[0].profile_pic ? user.rows[0].profile_pic: null;


    res.json({ username: user.rows[0].username, token });

  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};



module.exports = {
  loginAdmin,
};


