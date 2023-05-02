export const setFlightsDep = (_state, payload) => {
  _state.flights_departure = payload;
};

export const setFlightsArr = (_state, payload) => {
  _state.flights_arrival = payload;
};

export const setCards = (_state, payload) => {
  _state.cards = payload;
};

export const setAirlines = (_state, payload) => {
  _state.airlines = payload;
};

export const setRoutes = (_state, payload) => {
  _state.routes = payload;
};

export const setLoading = (_state, payload) => {
  _state.isLoading = payload;
};

export const clear_data = (_state) => {
  _state.routes = [];
  _state.flights_departure = [];
  _state.flights_arrival = [];
  _state.cards = [];
  _state.airlines = [];
};
