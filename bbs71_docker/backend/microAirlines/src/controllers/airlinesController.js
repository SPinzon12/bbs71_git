const Airline = require("../models/airlinesModel");
const Stats = require("../models/statsModel");
const mqtt = require("mqtt");

const options = {
  host: "192.168.100.2",
  port: 1884,
};
const client = mqtt.connect(options);

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
    const airline = await Stats.find({ user_id: iata });
    if (!airline) {
      return res.status(401).json({
        error: "No se encontró ninguna aerolínea con ese código IATA",
      });
    }
    
    let statistics = airline[0].stats;
    if (Object.keys(statistics).length === 0) {
      client.publish(
        "airport_airline_stats",
        JSON.stringify({
          id: iata,
          type: "airline",
        })
      );
      
      // Esperar hasta que las estadísticas estén actualizadas
      while (Object.keys(statistics).length === 0) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const updatedAirline = await Stats.find({ user_id: iata });
        statistics = updatedAirline[0].stats;
      }
    }

    const stats = [
      {
        number: statistics.tail_numbers,
        name: "Airplanes",
        icon: "fa-solid fa-plane",
      },
      {
        number: statistics.total_flights,
        name: "Total Flights",
        icon: "fa-solid fa-plane-departure",
      },
      {
        number: statistics.flights_cancelled,
        name: "Cancelled Flights",
        icon: "fa-solid fa-plane-circle-xmark",
      },
      // {
      //   number: flight_day,
      //   name: "Average Flights Day",
      //   icon: "fa-solid fa-plane-circle-check",
      // },
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
    const airline = await Stats.find({ user_id: iata });
    const routes = airline[0].routes;
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
