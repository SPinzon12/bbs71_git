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
      {
        $match: {
          "airline.iata": iata,
          "flightInfo.isCancelled": { $ne: true },
          "flightInfo.isDiverted": { $ne: true },
        },
      },
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

const routes = async (req, res) => {
  const iata = req.params.iata;
  try {
    const routes = await Airline.aggregate([
      // Buscamos los vuelos que tienen como origen o destino el aeropuerto dado
      {
        $match: { "airline.iata": iata },
      },
      // Agrupamos por las rutas de origen y destino
      {
        $group: {
          _id: {
            origin: "$route.from.origin",
            dest: "$route.to.dest",
            originCityName: "$departure.airport.originCityName",
            destCityName: "$arrival.airport.destCityName",
            distance: "$route.distance",
          },
          countCancelled: {
            $sum: { $cond: [{ $eq: ["$flightInfo.isCancelled", true] }, 1, 0] },
          },
          countDiverted: {
            $sum: { $cond: [{ $eq: ["$flightInfo.isDiverted", true] }, 1, 0] },
          },
          countNonCancelledNonDiverted: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $ne: ["$flightInfo.isCancelled", true] },
                    { $ne: ["$flightInfo.isDiverted", true] },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
      // Proyectamos los datos relevantes y realizamos el lookup en la misma colección
      {
        $project: {
          origin: "$_id.origin",
          dest: "$_id.dest",
          count: "$countNonCancelledNonDiverted",
          cancelled: "$countCancelled",
          diverted: "$countDiverted",
          originCityName: "$_id.originCityName",
          destCityName: "$_id.destCityName",
          distance: "$_id.distance",
          _id: 0,
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: 30,
      },
      {
        $lookup: {
          from: "flights",
          let: { origin: "$origin", dest: "$dest" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$route.from.origin", "$$origin"] },
                    { $eq: ["$route.to.dest", "$$dest"] },
                    { $ne: ["$route.actualElapsedTime", NaN] },
                  ],
                },
              },
            },
            {
              $addFields: {
                crsElapsedTimeInMinutes: {
                  $let: {
                    vars: {
                      parts: { $split: ["$route.crsElapsedTime", ":"] },
                      hours: {
                        $toInt: {
                          $arrayElemAt: [
                            { $split: ["$route.crsElapsedTime", ":"] },
                            0,
                          ],
                        },
                      },
                      minutes: {
                        $toInt: {
                          $arrayElemAt: [
                            { $split: ["$route.crsElapsedTime", ":"] },
                            1,
                          ],
                        },
                      },
                    },
                    in: { $add: [{ $multiply: ["$$hours", 60] }, "$$minutes"] },
                  },
                },
              },
            },
            {
              $addFields: {
                actualElapsedTimeInMinutes: {
                  $let: {
                    vars: {
                      parts: { $split: ["$route.actualElapsedTime", ":"] },
                      hours: {
                        $toInt: {
                          $arrayElemAt: [
                            { $split: ["$route.actualElapsedTime", ":"] },
                            0,
                          ],
                        },
                      },
                      minutes: {
                        $toInt: {
                          $arrayElemAt: [
                            { $split: ["$route.actualElapsedTime", ":"] },
                            1,
                          ],
                        },
                      },
                    },
                    in: { $add: [{ $multiply: ["$$hours", 60] }, "$$minutes"] },
                  },
                },
              },
            },
            {
              $group: {
                _id: {
                  origin: "$route.from.origin",
                  dest: "$route.to.dest",
                },
                avgActualElapsedTime: { $avg: "$actualElapsedTimeInMinutes" },
                avgCrsElapsedTime: { $avg: "$crsElapsedTimeInMinutes" },
              },
            },
            {
              $project: {
                _id: 0,
                avgActElapsedTime: { $round: ["$avgActualElapsedTime", 0] },
                avgCrsElapsedTime: { $round: ["$avgCrsElapsedTime", 0] },
              },
            },
          ],
          as: "routeInfo",
        },
      },
      { $unwind: "$routeInfo" },
      {
        $sort: {
          origin: 1,
          dest: 1,
        },
      },
    ]);
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
  airlines,
  flightsAirline,
  airlineStats,
  aircraftFlights,
  routes,
};
