import { createStore, combineReducers } from "redux";

function userReducer(
  state = {
    username: "",
    photo: "",
    description: "",
    email: "",
    groupMember: { role: "members" },
  },
  action
) {
  switch (action.type) {
    case "SET_USER":
      return action.user;
    case "UPDATE_USER":
      return Object.assign({}, state, action.user);
    case "SET_AUTHORIZATION_TRIED":
      return Object.assign({}, state, { authorizationTried: true });
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
            title: action.breadCrumb.title,
            category: action.breadCrumb.category,
            path: action.breadCrumb.path,
          },
        ])
        .filter((x, i) => i === 0 || i > state.length - 3);
    case "SELECT_BREADCRUMB":
      return state.filter((x, i) => i < action.breadCrumbIndex);
    default:
      return state;
  }
}
function notificationReducer(
  state = { title: "", message: "", expired: true },
  action
) {
  switch (action.type) {
    case "SET_NOTIFICATION":
      return action.notification;
    case "UPDATE_NOTIFICATION":
      return Object.assign({}, state, action.notification);
    default:
      return state;
  }
}

function groupReducer(
  state = {
    name: "",
    _id: "",
    interested_genres: [],
    create_date: 0,
    create_user: "",
    books: [],
  },
  action
) {
  switch (action.type) {
    case "SET_GROUP":
      return action.group;
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  user: userReducer,
  query: queryReducer,
  breadCrumbs: breadcrumbsReducer,
  group: groupReducer,
  notification: notificationReducer,
});

const store = createStore(
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;
