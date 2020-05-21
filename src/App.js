import React from "react";
import { Router, Route, Switch } from "react-router-dom";
import history from "./routing/history";
import Login from "./components/login/login";
import Signup from "./components/signup/signup";
import Profile from "./components/profile/profile";
import TermsAndConditions from "./components/policies/termsAndConditions";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <Router history={history}>
      <Switch>
        <Route exact path="/login" component={Login} />
        <Route exact path="/signup" component={Signup}></Route>
        <Route exact path="/profile" component={Profile}></Route>
        <Route exact path="/" component={Login}></Route>
        <Route
          exact
          path="/terms-and-conditions"
          component={TermsAndConditions}
        ></Route>
      </Switch>
      <ToastContainer />
    </Router>
  );
}

export default App;
