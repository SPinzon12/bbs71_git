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
  const airportID = parseInt(req.params.airportID);
  try {
    const routes = await Airport.aggregate([
      // Buscamos los vuelos que tienen como origen o destino el aeropuerto dado
      {
        $match: {
          $or: [
            { "departure.airport.originAirportID": airportID },
            { "arrival.airport.destAirportID": airportID },
          ],
        },
      },
      // Agrupamos por las rutas de origen y destino
      {
        $group: {
          _id: {
            origin: "$route.from.origin",
            dest: "$route.to.dest",
            originCityName: "$departure.airport.originCityName",
            destCityName: "$arrival.airport.destCityName",
            distance:"$route.distance"
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
          distance:"$_id.distance",
          _id: 0,
        },
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
  originAirports,
  destAirports,
  airportStats,
  airportAirlines,
  routes,
};
