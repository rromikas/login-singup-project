import { createStore, combineReducers } from "redux";

function userReducer(
  state = { username: "", photo: "", description: "", email: "" },
  action
) {
  switch (action.type) {
    case "SET_USER":
      return action.user;
    default:
      return state;
  }
}

function queryReducer(state = "", action) {
  switch (action.type) {
    case "SET_QUERY":
      return action.query;
    default:
      return state;
  }
}

function breadcrumbsReducer(state = [{ title: "home", path: "/" }], action) {
  switch (action.type) {
    case "ADD_BREADCRUMB":
      return state
        .concat([
          {
            title:
              action.breadCrumb.title.length > 10
                ? action.breadCrumb.title.substring(0, 10) + ". . ."
                : action.breadCrumb.title,
            category: action.breadCrumb.category,
            path: action.breadCrumb.path,
          },
        ])
        .filter((x, i) => i === 0 || i > state.length - 3);
    case "SELECT_BREADCRUMB":
      console.log("index breadcurumb", action.breadCrumbIndex);
      return state.filter((x, i) => i < action.breadCrumbIndex);
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  user: userReducer,
  query: queryReducer,
  breadCrumbs: breadcrumbsReducer,
});

const store = createStore(
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;
