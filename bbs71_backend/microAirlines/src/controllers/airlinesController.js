const Airline = require("../models/airlinesModel");
const Stats = require("../models/statsModel");
const mqtt = require("mqtt");

const options = {
  host: "192.168.100.2",
  port: 1883,
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
    
    let dataAnalysis = airline[0].stats;
    if (Object.keys(dataAnalysis).length === 0) {
      client.publish(
        "airport_airline_stats",
        JSON.stringify({
          id: iata,
          type: "airline",
        })
      );
      
      // Esperar hasta que las estadísticas estén actualizadas
      while (Object.keys(dataAnalysis).length === 0) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const updatedAirline = await Stats.find({ user_id: iata });
        dataAnalysis = updatedAirline[0].stats;
      }
    }

    const stats = [
      {
        value: dataAnalysis.tail_numbers,
        name: "Airplanes",
        icon: "fa-solid fa-plane",
      },
      {
        value: dataAnalysis.total_flights,
        name: "Total Flights",
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
