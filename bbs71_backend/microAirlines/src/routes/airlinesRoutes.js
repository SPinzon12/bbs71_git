const express = require("express");
const router = express.Router();
const {
    airlines,
    flightsAirline,
    airlineStats,
    aircraftFlights
} = require("../controllers/airlinesController");

router.get("/", airlines);
router.get("/:iata", flightsAirline);
router.get("/stats/:iata", airlineStats);
router.get("/aircraft/:iata", aircraftFlights);

module.exports = router;
