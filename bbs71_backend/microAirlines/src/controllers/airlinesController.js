const Airline = require("../models/airlinesModel");

const airlines = async (req, res) => {
  try {
    const airlines = await Airline.find().limit(10);

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

const flightsAirline = async (req, res) => {
  const iata = req.params.iata;
  try {
    const flightsAirline = await Airline.find({ "airline.iata": iata }).limit(
      100
    );

    if (flightsAirline.length == 0) {
      return res.status(401).json({
        error: "Esa aerolinea no existe",
      });
    }

    res.status(200).json({
      ok: true,
      flightsAirline,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      ok: false,
      msg: "Error Interno",
    });
  }
};

const airlineStats = async (req, res) => {
  const iata = req.params.iata;
  try {
    let airplanes = await Airline.find({ "airline.iata": iata }).distinct(
      "aircraft.tailNumber"
    );
    airplanes = airplanes.length;
    const cancelledFlightsCount = await Airline.countDocuments({
      "airline.iata": iata,
      "flightInfo.isCancelled": true,
    });
    let totalFlights = await Airline.countDocuments({
      "airline.iata": iata,
      $and: [
        { "flightInfo.isCancelled": { $ne: true } },
        { "flightInfo.isDiverted": { $ne: true } },
      ],
    });

    let flight_day = await Airline.aggregate([
      {
        $match: {
          "airline.iata": iata,
        },
      },
      {
        $group: {
          _id: "$flightInfo.flightDate",
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: null,
          number: { $avg: "$count" },
        },
      },
      {
        $project: {
          _id: 0,
          number: 1,
        },
      },
    ]);

    flight_day = flight_day[0].number.toFixed(0);

    if (airplanes === 0) {
      return res.status(401).json({
        error: "No se encontró ninguna aerolínea con ese código IATA",
      });
    }

    const stats = [
      {
        number: airplanes,
        name: "Airplanes",
        icon: "fa-solid fa-plane",
      },
      {
        number: totalFlights,
        name: "Total Flights",
        icon: "fa-solid fa-plane-departure",
      },
      {
        number: cancelledFlightsCount,
        name: "Cancelled Flights",
        icon: "fa-solid fa-plane-circle-xmark",
      },
      {
        number: flight_day,
        name: "Average Flights Day",
        icon: "fa-solid fa-plane-circle-check",
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

const aircraftFlights = async (req, res) => {
  const iata = req.params.iata;
  try {
    let airline = await Airline.find({ "airline.iata": iata });
    if (!airline) {
      return res.status(401).json({
        error: "No se encontró ninguna aerolínea con ese código IATA",
      });
    }
    let airplanes = await Airline.aggregate([
      // Filtrar los vuelos de la aerolínea "Airline A"
      { $match: { "airline.iata": iata } },
      // Agrupar los documentos por el número de cola del avión
      { $group: { _id: "$aircraft.tailNumber", count: { $sum: 1 } } },
      // Ordenar los resultados en función del número de vuelos (de mayor a menor)
      { $sort: { count: -1 } },
      // Proyectar solo los campos que nos interesan
      { $project: { tailNumber: "$_id", count: 1, _id: 0 } },
    ]);

    res.status(200).json({
      ok: true,
      airplanes,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      ok: false,
      msg: "Error Interno",
    });
  }
};
module.exports = { airlines, flightsAirline, airlineStats, aircraftFlights };
