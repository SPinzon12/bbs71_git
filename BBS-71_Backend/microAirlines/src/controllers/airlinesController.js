const Airline = require('../models/airlinesModel');

const airlines = async (req, res) => {
    try {
        const airlines = await Airline.find().limit(10);

        res.status(200).json({
            ok: true,
            airlines
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            ok: false,
            msg: 'Error Interno'
        })
    }
}

const flightsAirline = async (req, res) => {
    const  iata  = req.params.iata
    try {
        const flightsAirline = await Airline.find({ "airline.iata" : iata }).limit(10)

        if (flightsAirline.length == 0) {
            return res.status(401).json({
              error: "Esa aerolinea no existe",
            });
          }

        res.status(200).json({
            ok: true,
            flightsAirline
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            ok: false,
            msg: 'Error Interno'
        })
    }
}


module.exports = { airlines, flightsAirline }