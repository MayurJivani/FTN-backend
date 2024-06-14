const batchModel = require('../models/batchModel');

const getBatches = async (req, res) => {
  try {
    if (req.user.role !== "mentor") {
        return res.status(401).json({ error: "Unauthorized" });
    }
    const batches = await batchModel.getAllBatches();
    res.json(batches);
  } catch (error) {
    console.error('Error fetching batches:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getBatches,
};
