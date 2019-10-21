export default function weather(state = {}, action) {
  switch (action.type) {
    case 'UPDATE_WEATHER':
      return {
        ...state,
        ...action.weather,
      };
    default:
      return state;
  }
}
