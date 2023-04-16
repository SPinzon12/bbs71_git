const axios = require("axios");
const express = require("express");
const router = express.Router();

const airlineMicroserv = process.env.AIRLINE_MICROSERV;

router.get("/", async (req, res) => {
  try {
    const response = await axios.get(`${airlineMicroserv}/airlines/`);
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:iata", async (req, res) => {
  // console.log(req.params.iata);
  try {
    const response = await axios.get(
      `${airlineMicroserv}/airlines/${req.params.iata}`
    );
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/stats/:iata", async (req, res) => {
  try {
    const response = await axios.get(
      `${airlineMicroserv}/airlines/stats/${req.params.iata}`
    );
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/aircraft/:iata", async (req, res) => {
  try {
    const response = await axios.get(
      `${airlineMicroserv}/airlines/aircraft/${req.params.iata}`
    );
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
