const express = require('express')
const router = express.Router();
const { originAirports, destAirports } = require('../controllers/airportController');

router.get('/departure/:originAirportID', originAirports)
router.get('/arrival/:destAirportID', destAirports)

module.exports = router