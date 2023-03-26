const Airport = require('../models/ariportModel')

const originAirports = async (req, res) => {
    const originAirportID = parseInt(req.params.originAirportID)
    // console.log(originAirportID);
    try {
        const originAirports = await Airport.find({"departure.airport.originAirportID":(originAirportID)}).sort(Departure.DepTime).limit(10);

        if (originAirports.length == 0) {
            return res.status(401).json({
              error: "Ese aeropuerto no existe",
            });
          }

        res.status(200).json({
            ok: true,
            originAirports
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            ok: false,
            msg: 'Error Interno'
        })
    }
}


const destAirports = async (req, res) => {
    const destAirportID = parseInt(req.params.destAirportID)
    // console.log(destAirportID); 
    try {
        const destAirports = await Airport.find({"arrival.airport.destAirportID":(destAirportID)}).limit(10);

        if (destAirports.length == 0) {
            return res.status(401).json({
              error: "Ese aeropuerto no existe",
            });
          }

        res.status(200).json({
            ok: true,
            destAirports
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            ok: false,
            msg: 'Error Interno'
        })
    }
}

module.exports = {originAirports, destAirports}