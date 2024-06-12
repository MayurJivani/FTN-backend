const mentorModel = require('../models/mentorModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); 
require('dotenv').config();
const pool = require('../config/database');

exports.addMentor = async (req, res) => {
    try {
      const { name, email, phoneno, forte, password } = req.body;
      const profile_pic = req.file ? req.file.buffer : null;
      
      const hashedPassword = await bcrypt.hash(password, 10);

      const newMentor = await mentorModel.addMentor({
        name, email, phoneno, profile_pic, forte, hashedPassword
      });
  
      res.status(201).json(newMentor);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  
  exports.getAllMentors = async (req, res) => {
    try {
      const mentors = await mentorModel.getAllMentors();
      res.status(200).json(mentors);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await pool.query('SELECT * FROM mentors WHERE email = $1', [email]);
      if (user.rows.length === 0) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      const isPasswordValid = await bcrypt.compare(password, user.rows[0].password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
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
        username: user.rows[0].name,
        role: "mentor",
        //zegoToken: zegoToken,
      };    
  
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
  
      const profilePic = user.rows[0].profile_pic ? user.rows[0].profile_pic: null;
  
  
      res.json({ username: user.rows[0].name, token, profilePic });
  
    } catch (error) {
      console.error('Error logging in:', error);
      res.status(500).json({ message: 'Server Error' });
    }
  };