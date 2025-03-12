const express = require("express");
const router = express.Router();
const { getAllStates } = require("../controllers/states.controller");

router.get("/get_all_states", getAllStates);

module.exports = router;
