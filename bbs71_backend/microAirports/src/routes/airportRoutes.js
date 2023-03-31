const express = require('express')
const router = express.Router();
const { originAirports, destAirports, airportStats } = require('../controllers/airportController');

router.get('/departure/:originAirportID', originAirports)
router.get('/arrival/:destAirportID', destAirports)
router.get("/stats/:airportID", airportStats);

module.exports = router