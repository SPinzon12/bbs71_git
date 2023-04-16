const Airport = require("../models/ariportModel");

const originAirports = async (req, res) => {
  const originAirportID = parseInt(req.params.originAirportID);

  try {
    const originAirports = await Airport.find({
      "departure.airport.originAirportID": originAirportID,
    }).limit(100);

    if (originAirports.length == 0) {
      return res.status(401).json({
        error: "Ese aeropuerto no existe",
      });
    }

    res.status(200).json({
      ok: true,
      originAirports,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      ok: false,
      msg: "Error Interno",
    });
  }
};

const destAirports = async (req, res) => {
  const destAirportID = parseInt(req.params.destAirportID);
  // console.log(destAirportID);
  try {
    const destAirports = await Airport.find({
      "arrival.airport.destAirportID": destAirportID,
    }).limit(100);

    if (destAirports.length == 0) {
      return res.status(401).json({
        error: "Ese aeropuerto no existe",
      });
    }

    res.status(200).json({
      ok: true,
      destAirports,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      ok: false,
      msg: "Error Interno",
    });
  }
};

const airportStats = async (req, res) => {
  const airportID = parseInt(req.params.airportID);
  //   console.log(airportID);
  try {
    const totalArrivals = await Airport.countDocuments({
      "arrival.airport.destAirportID": airportID,
      $and: [
        { "flightInfo.isCancelled": { $ne: true } },
        { "flightInfo.isDiverted": { $ne: true } },
      ],
    });

    const totalDepartures = await Airport.countDocuments({
      "departure.airport.originAirportID": airportID,
      $and: [
        { "flightInfo.isCancelled": { $ne: true } },
        { "flightInfo.isDiverted": { $ne: true } },
      ],
    });

    const cancelledFlights = await Airport.find({
      $and: [
        {
          $or: [
            { "route.from.originAirportID": airportID },
            { "route.to.destAirportID": airportID },
          ],
        },
        { "flightInfo.isCancelled": true },
      ],
    });

    const totalCancelledFlights = cancelledFlights.length;

    if (totalArrivals === 0 && totalDepartures === 0) {
      return res.status(404).json({
        error: "No se encontró ningún aeropuerto con ese código",
      });
    }

    const stats = [
      {
        number: totalArrivals,
        name: "Arrivals",
        icon: "fa-solid fa-plane-arrival",
      },
      {
        number: totalDepartures,
        name: "Departures",
        icon: "fa-solid fa-plane-departure",
      },
      {
        number: totalCancelledFlights,
        name: "Cancelled Flights",
        icon: "fa-solid fa-plane-circle-xmark",
      },
    ];

    res.status(200).json({
      ok: true,
      stats,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      ok: false,
      msg: "Error Interno",
    });
  }
};

module.exports = { originAirports, destAirports, airportStats };
