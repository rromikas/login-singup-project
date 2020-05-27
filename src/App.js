import React, { useEffect } from "react";
import { Router, Route, Switch } from "react-router-dom";
import history from "./routing/history";
import Login from "./components/login/login";
import Signup from "./components/signup/signup";
import Profile from "./components/profile/profile";
import TermsAndConditions from "./components/policies/termsAndConditions";
import { ToastContainer } from "react-toastify";
import Home from "./components/home/home";
import Search from "./components/search/search";
import Book from "./components/book/book";
import NewThreadForm from "./components/discussion/newThreadForm";
import Thread from "./components/discussion/thread";
import { Provider } from "react-redux";
import store from "./store/store";
import PrivateRoute from "./routing/privateRoute";
import { readUser, signup } from "./javascript/requests";
import Form from "./components/addBook/Form";

function App() {
  useEffect(() => {
    readUser(localStorage["secret_token"], (res) => {
      if (!res.error && res.user) {
        store.dispatch({ type: "SET_USER", user: res.user });
      }
    });
  }, []);

  return (
    <Provider store={store}>
      <Router history={history}>
        <Switch>
          <Route exact path="/login" component={Login} />
          <Route exact path="/signup" component={Signup}></Route>
          <Route exact path="/profile" component={Profile}></Route>
          <Route exact path="/search" component={Search}></Route>
          <Route
            path="/add-book"
            exact
            render={(props) => <Form {...props} />}
          />
          <PrivateRoute
            bearerPath="/login"
            exact
            path="/books/:bookId/threads/new"
            Component={NewThreadForm}
          ></PrivateRoute>
          <Route
            exact
            path="/books/:bookId/threads/:threadId"
            component={Thread}
          ></Route>
          <Route exact path="/books/:bookId" component={Book}></Route>
          <Route exact path="/" component={Home}></Route>
          <Route
            exact
            path="/terms-and-conditions"
            component={TermsAndConditions}
          ></Route>
        </Switch>
        <ToastContainer />
      </Router>
    </Provider>
  );
}

export default App;
