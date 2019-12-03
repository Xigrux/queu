import { createStore } from "redux";
let reducer = (state, action) => {
  if (action.type === "login") {
    return { ...state, authStatus: action.authStatus };
  }

  if (action.type === "logout") {
    return {
      authStatus: { type: undefined, isLoggedIn: false },
      eventObj: undefined,
      participantObj: undefined
    };
  }

  if (action.type === "load-eventObj") {
    return { ...state, eventObj: action.eventObj };
  }

  if (action.type === "load-participantObj") {
    return { ...state, participantObj: action.participantObj };
  }

  return state;
};

let initialState = {
  authStatus: { type: undefined, isLoggedIn: false },
  eventObj: undefined,
  participantObj: undefined
};

let store = createStore(
  reducer,
  initialState,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;
