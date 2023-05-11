const express = require("express");
const router = express.Router();
const {
    originAirports,
    destAirports,
    airportStats,
    airportAirlines,
    routes,
} = require("../controllers/airportController");

router.get("/departure/:originAirportID", originAirports);
router.get("/arrival/:destAirportID", destAirports);
router.get("/stats/:airportID", airportStats);
router.get("/airlines/:airportID", airportAirlines);
router.get("/routes/:airportID", routes);

module.exports = router;
