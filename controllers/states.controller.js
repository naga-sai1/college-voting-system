const { Op } = require("sequelize");
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

// create new state
const createState = async (req, res) => {
  try {
    const { States } = await connectToDatabase();
    const { name, abbreviation } = req.body;

    // Validate required fields
    if (!name || !abbreviation) {
      return res.status(400).json({
        message: "Name and abbreviation are required fields",
      });
    }

    // Check for existing state with same name or abbreviation
    const existingState = await States.findOne({
      where: {
        [Op.or]: [{ name: name }, { abbreviation: abbreviation }],
      },
    });

    if (existingState) {
      return res.status(400).json({
        message: "State with this name or abbreviation already exists",
      });
    }

    // Create new state
    const newState = await States.create({
      name,
      abbreviation,
      created_at: new Date(),
      updated_at: null,
    });

    // Format the response
    const formattedState = {
      id: newState.id,
      name: newState.name,
      abbreviation: newState.abbreviation,
      created_at: new Date(newState.created_at).toISOString().split("T")[0],
      updated_at: null,
    };

    res.status(201).json({
      message: "State created successfully",
      state: formattedState,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = {
  getAllStates,
  createState,
};
