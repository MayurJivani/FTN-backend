const bcrypt = require('bcrypt');
const pool = require('../config/database');
const jwt = require('jsonwebtoken');
const { generateToken04 } = require('../models/zegoTokenGenerator'); 
require('dotenv').config();
const sendEmail = require('../utils/sendEmail');

const appId = parseInt(process.env.ZEGO_APP_ID, 10);
const secret = process.env.ZEGO_WEB_SECRET;

const getAllUsers = async (req, res) => {
  try {
    const users = await pool.query('SELECT * FROM users');
    res.json(users.rows);
  } catch (error) {
    console.error('Error getting users:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const registerUser = async (req, res) => {
  const { username, email, password, phoneno } = req.body;
  try {
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const idResult = await pool.query('SELECT COUNT(*) FROM users');
    const idCount = parseInt(idResult.rows[0].count) + 1;
    const paddedId = idCount.toString().padStart(2, '0'); 
    const year = new Date().getFullYear().toString().slice(-2); 
    const userId = `${year}FTN${paddedId}`;

    await pool.query('INSERT INTO users (user_id, username, email, password, phoneno) VALUES ($1, $2, $3, $4, $5)', [userId, username, email, hashedPassword, phoneno]);
    
    await sendEmail(email, username);

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (user.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.rows[0].password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (user.rows[0].subscription !== 'active') {
      return res.status(403).json({ message: 'Please purchase course to access' });
    }

    //console.log(typeof appId);

    // const zegoToken = generateToken04(
    //   appId, 
    //   user.rows[0].user_id, 
    //   secret, 
    //   86400, 
    // );

    const payload = {
      id: user.rows[0].user_id,
      email: user.rows[0].email,
      username: user.rows[0].username,
      //zegoToken: zegoToken,
    };    

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

    const profilePic = user.rows[0].profile_pic ? user.rows[0].profile_pic: null;


    res.json({ username: user.rows[0].username, token, profilePic });

  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const getUserDetails = async (req, res) => {
  const { id } = req.user; 

  try {
    const userQuery = 'SELECT * FROM users WHERE user_id = $1';
    const userResult = await pool.query(userQuery, [id]);
    
    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = userResult.rows[0];
    delete user.password; 

    res.json(user);
  } catch (error) {
    console.error('Error getting user details:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.user; // Assume the user ID is obtained from the auth middleware
  const { firstName, lastName, username, phoneNo, email, bio } = req.body;
  const profilePic = req.file ? req.file.buffer : null; // Get the file buffer

  try {
    let updateUserQuery = 'UPDATE users SET';
    const params = [];
    let paramIndex = 1;

    if (firstName) {
      updateUserQuery += ` first_name = $${paramIndex},`;
      params.push(firstName);
      paramIndex++;
    }

    if (lastName) {
      updateUserQuery += ` last_name = $${paramIndex},`;
      params.push(lastName);
      paramIndex++;
    }

    if (username) {
      updateUserQuery += ` username = $${paramIndex},`;
      params.push(username);
      paramIndex++;
    }

    if (phoneNo) {
      updateUserQuery += ` phoneno = $${paramIndex},`;
      params.push(phoneNo);
      paramIndex++;
    }

    if (email) {
      updateUserQuery += ` email = $${paramIndex},`;
      params.push(email);
      paramIndex++;
    }

    if (bio) {
      updateUserQuery += ` bio = $${paramIndex},`;
      params.push(bio);
      paramIndex++;
    }

    if (profilePic) {
      updateUserQuery += ` profile_pic = $${paramIndex},`;
      params.push(profilePic);
      paramIndex++;
    }

    // Remove the last comma and add the WHERE clause
    updateUserQuery = updateUserQuery.slice(0, -1);
    updateUserQuery += ` WHERE user_id = $${paramIndex}`;
    params.push(id);

    await pool.query(updateUserQuery, params);

    res.status(200).json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getAllUsers,
  registerUser,
  loginUser,
  getUserDetails,
  updateUser,
};
