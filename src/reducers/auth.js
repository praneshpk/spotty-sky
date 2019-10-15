export default function auth(state = {}, action) {
  switch(action.type) {
    case 'REDIRECT':
      return {
        ...state,
        token: action.token
      };
    default:
      return state;
  }
}