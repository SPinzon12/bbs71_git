export const set_user = (state, data) => {
  state.user = data
}

export const clear_user = (state) => {
  state.user = null
}

export const set_error_message = (state, message) => {
  state.error_message = message;
}
