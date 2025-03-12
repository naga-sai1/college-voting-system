const express = require("express");
const router = express.Router();
const { conductPoll, getAllpollsByStateId, resetAllPolls } = require("../controllers/polls.controller");

router.post("/conduct_poll", conductPoll);
// router.get('/state_wise_poll_parties', getStateWisePollParties);
router.get('/get_all_polls/:id', getAllpollsByStateId);
router.delete("/reset_all_polls", resetAllPolls);

module.exports = router; 