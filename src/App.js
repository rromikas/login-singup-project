import React from "react";
import { Router, Route, Switch } from "react-router-dom";
import history from "./routing/history";
import Login from "./components/login/login";
import Signup from "./components/signup/signup";
import Profile from "./components/profile/profile";
import TermsAndConditions from "./components/policies/termsAndConditions";
import { ToastContainer } from "react-toastify";
import Main from "./components/main/main";
import Search from "./components/search/search";
import Book from "./components/book/book";
import NewThreadForm from "./components/discussion/newThreadForm";
import Thread from "./components/discussion/thread";

function App() {
  let arr = [1, 2, 3, 5];
  let arr1 = arr.slice(0, 10);
  console.log(arr1);
  return (
    <Router history={history}>
      <Switch>
        <Route exact path="/login" component={Login} />
        <Route exact path="/signup" component={Signup}></Route>
        <Route exact path="/profile" component={Profile}></Route>
        <Route exact path="/search" component={Search}></Route>
        <Route
          exact
          path="/books/:bookId/threads/new"
          component={NewThreadForm}
        ></Route>
        <Route
          exact
          path="/books/:bookId/threads/:threadId"
          component={Thread}
        ></Route>
        <Route exact path="/books/:bookId" component={Book}></Route>
        <Route exact path="/" component={Main}></Route>
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
