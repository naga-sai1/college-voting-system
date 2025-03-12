const express = require("express");
const router = express.Router();
const {
  getAllVoters,
  castVote,
  loginVoter,
  totalVotersCount,
  sendOTP,
  verifyOTP,
  addVoter,
} = require("../controllers/voters.controller");

router.get("/get_all_voters", getAllVoters);
router.post("/cast_vote", castVote);
router.post("/login_voter", loginVoter);
router.get("/total_voters_count", totalVotersCount);
router.post("/send_otp", sendOTP);
router.post("/verify_otp", verifyOTP);
router.post("/add_voter", addVoter);

module.exports = router;
