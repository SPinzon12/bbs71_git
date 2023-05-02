export const setFlights = (_state, payload) => {
  _state.flights = payload;
};

export const setCards = (_state, payload) => {
  _state.cards = payload;
};

export const setAirplanes = (_state, payload) => {
  _state.airplanes = payload;
};

export const setRoutes = (_state, payload) => {
  _state.routes = payload;
};

export const setLoading = (_state, payload) => {
  _state.isLoading = payload;
};

export const clear_data = (_state) => {
  _state.routes = [];
  _state.flights = [];
  _state.cards = [];
  _state.airplanes = [];
};