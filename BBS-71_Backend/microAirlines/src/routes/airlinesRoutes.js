const express = require('express')
const router = express.Router();
const {airlines, flightsAirline} = require('../controllers/airlinesController');

router.get('/', airlines)
router.get('/:iata', flightsAirline)

module.exports = router