import { BBS71 } from "../../api/api";

export async function getFlightsDep(context, details) {
  const { user_id } = details;
  try {
    const api = await BBS71.get(`/airport/departure/${user_id}`);
    if (api.status == 200) {
      const { data } = api;
      context.commit("setFlightsDep", data.originAirports);
    }
  } catch (error) {
    console.log("Error fetching flights: ", error);
  }
}

export async function getFlightsArr(context, details) {
  const { user_id } = details;
  try {
    const api = await BBS71.get(`/airport/arrival/${user_id}`);
    if (api.status == 200) {
      const { data } = api;
      context.commit("setFlightsArr", data.destAirports);
    }
  } catch (error) {
    console.log("Error fetching flights: ", error);
  }
}

export async function getCards(context, details) {
  const { user_id } = details;
  try {
    const api = await BBS71.get(`/airport/stats/${user_id}`);
    if (api.status == 200) {
      const { data } = api;
      context.commit("setCards", data.stats);
    }
  } catch (error) {
    console.log("Error fetching cards: ", error);
  }
}

export async function getAirlines(context, details) {
  const { user_id } = details;
  try {
    const api = await BBS71.get(`/airport/airlines/${user_id}`);
    if (api.status == 200) {
      const { data } = api;
      context.commit("setAirlines", data.airlines);
    }
  } catch (error) {
    console.log("Error fetching airlines: ", error);
  }
}

export async function getRoutes(context, details) {
  const { user_id } = details;
  try {
    context.commit("setLoading", true);
    const api = await BBS71.get(`/airport/routes/${user_id}`);
    if (api.status == 200) {
      const { data } = api;
      context.commit("setRoutes", data.routes);
    }
  } catch (error) {
    console.log("Error fetching routes: ", error);
  } finally {
    context.commit("setLoading", false);
  }
}

export async function clearData(context) {
  try {
    context.commit("clear_data");
  } catch (err) {
    console.error(err);
  }
}
