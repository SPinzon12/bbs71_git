import { BBS71 } from "../../api/api";

export async function getFlights(context, details) {
  const { user_id } = details;
  try {
    const api = await BBS71.get(`/airline/${user_id}`);
    if (api.status == 200) {
      const { data } = api;
      context.commit("setFlights", data.flightsAirline);
    }
  } catch (error) {
    console.log("Error fetching flights: ", error);
  }
}

export async function getCards(context, details) {
  const { user_id } = details;
  try {
    const api = await BBS71.get(`/airline/stats/${user_id}`);
    if (api.status == 200) {
      const { data } = api;
      context.commit("setCards", data.stats);
    }
  } catch (error) {
    console.log("Error fetching cards: ", error);
  }
}

export async function getAirplanes(context, details) {
  const { user_id } = details;
  try {
    const api = await BBS71.get(`/airline/aircraft/${user_id}`);
    if (api.status == 200) {
      const { data } = api;
      context.commit("setAirplanes", data.airplanes);
    }
  } catch (error) {
    console.log("Error fetching airplanes: ", error);
  }
}