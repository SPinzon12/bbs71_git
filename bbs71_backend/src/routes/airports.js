const axios = require("axios");
const express = require("express");
const router = express.Router();

const airportMicroserv = process.env.AIRPORT_MICROSERV;

router.get("/departure/:originAirportID", async (req, res) => {
  try {
    const response = await axios.get(
      `${airportMicroserv}/airports/departure/${req.params.originAirportID}`
    );
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/arrival/:destAirportID", async (req, res) => {
  try {
    const response = await axios.get(
      `${airportMicroserv}/airports/arrival/${req.params.destAirportID}`
    );
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/stats/:airportID", async (req, res) => {
  try {
    const response = await axios.get(
      `${airportMicroserv}/airports/stats/${req.params.airportID}`
    );
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
