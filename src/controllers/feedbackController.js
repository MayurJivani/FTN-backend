const { insertFeedback } = require('../models/feedbackModel');

const saveFeedback = async (req, res) => {
  const { response } = req.body;
  const user_id = req.user.id;

  if (!user_id || !response) {
    return res.status(400).json({ message: 'User ID and response are required' });
  }

  try {
    const feedback = await insertFeedback(user_id, response);
    res.status(201).json(feedback);
  } catch (error) {
    console.error('Error saving feedback:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  saveFeedback,
};
