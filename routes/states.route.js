const express = require("express");
const router = express.Router();
const { getAllStates, createState } = require("../controllers/states.controller");

router.get("/get_all_states", getAllStates);
router.post("/create_state", createState);

module.exports = router;
