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