const express = require("express");
const router = express.Router();

const { getLatestPositions, getPositionHistory } = require("../controllers/positionController");

router.get("/latest", getLatestPositions);
router.get("/:imei/history", getPositionHistory);

module.exports = router;
