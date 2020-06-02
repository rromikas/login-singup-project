import React, { useEffect, useState } from "react";
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
import NewThreadForm from "./components/book/discussion/newThreadForm";
import Thread from "./components/book/discussion/thread";
import { Provider } from "react-redux";
import store from "./store/store";
import PrivateRoute from "./routing/privateRoute";
import { ReadUser } from "./api/socket-requests";
import Form from "./components/addBook/Form";
import Navbar from "./components/navbar/navbar";
import SideNavbar from "./components/navbar/SideNavbar";
import BreadCrumbs from "./components/navbar/BreadCrumbs";
import WriteSummaryForm from "./components/book/summaries/Form";

function App() {
  const [isMenuOpened, setMenu] = useState(false);

  useEffect(() => {
    ReadUser(localStorage["secret_token"], (res) => {
      if (!res.error && res.user) {
        store.dispatch({ type: "SET_USER", user: res.user });
      }
    });
  }, []);

  return (
    <Provider store={store}>
      <Router history={history}>
        <div
          className="w-100 overflow-auto bg-theme p-lg-4 p-0"
          style={{ minHeight: "100%" }}
        >
          <div
            className="container-fluid px-0 bg-light corners-theme"
            style={{
              maxWidth: "1200px",
              overflow: "hidden",
            }}
          >
            <Navbar setMenu={setMenu} isMenuOpened={isMenuOpened}></Navbar>
            <BreadCrumbs></BreadCrumbs>
            <div className="row no-gutters" style={{ position: "relative" }}>
              <SideNavbar
                isMenuOpened={isMenuOpened}
                setMenu={setMenu}
              ></SideNavbar>
              <div
                className="w-100 h-100"
                style={{
                  transition: "opacity 0.3s",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  background: "black",
                  visibility: isMenuOpened ? "visible" : "hidden",
                  opacity: isMenuOpened ? "0.3" : "0",
                  zIndex: 3,
                  pointerEvents: "all",
                }}
              ></div>
              <div className="col">
                <Switch>
                  <Route exact path="/login" component={Login} />
                  <Route exact path="/signup" component={Signup}></Route>
                  <Route exact path="/profile" component={Profile}></Route>
                  <Route exact path="/search/:query" component={Search}></Route>
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
                  <PrivateRoute
                    bearerPath="/login"
                    exact
                    path="/books/:bookId/summaries/new"
                    Component={WriteSummaryForm}
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
              </div>
            </div>
          </div>
        </div>

        <ToastContainer />
      </Router>
    </Provider>
  );
}

export default App;
