const express = require("express");
const router = express.Router();
const {
    airlines,
    flightsAirline,
    airlineStats,
} = require("../controllers/airlinesController");

router.get("/", airlines);
router.get("/:iata", flightsAirline);
router.get("/stats/:iata", airlineStats);

module.exports = router;
