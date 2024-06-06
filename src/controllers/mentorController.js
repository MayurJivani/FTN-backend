const mentorModel = require('../models/mentorModel');

exports.addMentor = async (req, res) => {
    try {
      const { name, email, phoneno, forte } = req.body;
      const profile_pic = req.file ? req.file.buffer : null;
  
      const newMentor = await mentorModel.addMentor({
        name, email, phoneno, profile_pic, forte
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