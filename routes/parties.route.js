const express = require("express");
const router = express.Router();
const { getAllParties, createParty, getPartyWiseVotingCount } = require("../controllers/parties.controller");
const upload = require("../middleware/upload.middleware");

router.get("/get_all_parties", getAllParties);
router.post("/create_party", upload.single('logo'), createParty);
router.get("/party-wise-voting-count", getPartyWiseVotingCount);

module.exports = router;
