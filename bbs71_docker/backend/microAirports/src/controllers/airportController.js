const Airport = require("../models/ariportModel");
const Stats = require("../models/statsModel");
const mqtt = require("mqtt");

const options = {
  host: "192.168.100.2",
  port: 1883,
};
const client = mqtt.connect(options);

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
  const airportID = req.params.airportID;
  try {
    const airport = await Stats.find({ user_id: airportID });
    if (!airport) {
      return res.status(401).json({
        error: "No se encontró ningún aeropuerto con ese código",
      });
    }
    let dataAnalysis = airport[0].stats;
    if (Object.keys(dataAnalysis).length === 0) {
      client.publish(
        "airport_airline_stats",
        JSON.stringify({
          id: airportID,
          type: "airport",
        })
      );

      // Esperar hasta que las estadísticas estén actualizadas
      while (Object.keys(dataAnalysis).length === 0) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const updatedAirline = await Stats.find({ user_id: airportID });
        dataAnalysis = updatedAirline[0].stats;
      }
    }

    const stats = [
      {
        value: dataAnalysis.flights_arrivals,
        name: "Arrivals",
        icon: "fa-solid fa-plane-arrival",
      },
      {
        value: dataAnalysis.flights_departures,
        name: "Departures",
        icon: "fa-solid fa-plane-departure",
      },
      {
        value: dataAnalysis.flights_cancelled,
        name: "Cancelled Flights",
        icon: "fa-solid fa-plane-circle-xmark",
      },
      {
        value: dataAnalysis.flights_delay,
        name: "Delayed Flight",
        icon: "fa-solid fa-plane-circle-exclamation",
      },
      {
        value: `${dataAnalysis.flight_month.month} ${dataAnalysis.flight_month.num_flights}`,
        name: "Most Flights in a Month",
        icon: "fa-solid fa-calendar",
      },
      {
        value: dataAnalysis.flights_holidaySeason,
        name: "Holiday Season Flights",
        icon: "fa-solid fa-umbrella-beach",
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

const airportAirlines = async (req, res) => {
  const airportID = parseInt(req.params.airportID);
  try {
    const airlines = await Airport.aggregate([
      {
        $match: {
          $or: [
            { "departure.airport.originAirportID": airportID },
            { "arrival.airport.destAirportID": airportID },
          ],
          "flightInfo.isCancelled": { $ne: true },
          "flightInfo.isDiverted": { $ne: true },
        },
      },
      {
        $group: {
          _id: {
            iata: "$airline.iata",
            name: "$airline.name",
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      {
        $project: {
          iata: "$_id.iata",
          name: "$_id.name",
          count: 1,
          _id: 0,
        },
      },
    ]);

    if (airlines.length === 0) {
      return res.status(404).json({
        error: "No se encontraron vuelos de aerolíneas para este aeropuerto",
      });
    }
    res.status(200).json({
      ok: true,
      airlines,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      ok: false,
      msg: "Error Interno",
    });
  }
};

const routes = async (req, res) => {
  const airportID = req.params.airportID;
  try {
    const airport = await Stats.find({ user_id: airportID });
    const routes = airport[0].routes;
    if (routes.length === 0) {
      return res.status(404).json({
        error: "No se encontraron rutas",
      });
    }
    res.status(200).json({
      ok: true,
      routes,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      ok: false,
      msg: "Error Interno",
    });
  }
};

module.exports = {
  originAirports,
  destAirports,
  airportStats,
  airportAirlines,
  routes,
};
