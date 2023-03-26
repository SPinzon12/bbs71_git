import { BBS71 } from "../../api/api";

export async function getFlights(context,details) {
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