import { createStore } from "redux";
let reducer = (state, action) => {
  if (action.type === "login") {
    return { ...state, authStatus: action.authStatus };
  }

  if (action.type === "logout") {
    return { ...state, authStatus: { type: undefined, isLoggedIn: false } };
  }

  if (action.type === "load-event") {
    return { ...state, event: action.event };
  }
  return state;
};

let initialState = {
  authStatus: { type: "OG", isLoggedIn: false },
  event: undefined
};

let store = createStore(
  reducer,
  initialState,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;
