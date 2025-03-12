const connectToDatabase = require("../misc/db.js");

// Get all states
const getAllStates = async (req, res) => {
  try {
    const { States } = await connectToDatabase();
    const states = await States.findAll();
    res.status(200).json({ message: "States fetched successfully", states });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

module.exports = {
  getAllStates,
};
