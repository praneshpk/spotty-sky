export default function auth(state = {}, action) {
  switch (action.type) {
    case 'GEN_TOKEN':
      return {
        ...state,
        token: action.token,
      };
    case 'DEL_TOKEN':
      return {
        ...state,
        token: null,
      };
    default:
      return state;
  }
}
