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
import { ReadUser, GetGroup } from "./api/socket-requests";
import Form from "./components/addBook/Form";
import Navbar from "./components/navbar/navbar";
import SideNavbar from "./components/navbar/SideNavbar";
import BreadCrumbs from "./components/navbar/BreadCrumbs";
import WriteSummaryForm from "./components/book/summaries/Form";
import Summary from "./components/book/summaries/Summary";
import SummaryEditForm from "./components/book/summaries/SummaryEditForm";
import CreateGroupForm from "./components/group/CreateGroupForm";
import Group from "./components/group/Group";
import CreateQuizForm from "./components/book/quiz/CreateQuizForm";
import PuffLoader from "react-spinners/PuffLoader";
import Quiz from "./components/book/quiz/Quiz";
import { connect } from "react-redux";
import Toast from "./components/utility/Toast";
import { BsSearch, BsPlus } from "react-icons/bs";
import { GetFilteredGroups } from "./api/socket-requests";
import { BsImage } from "react-icons/bs";
import { uid } from "react-uid";

function App() {
  const [isMenuOpened, setMenu] = useState(false);
  const [isAuthenticationPage, setIsAuthenticationPage] = useState(false);

  useEffect(() => {
    if (
      history.location.pathname === "/login" ||
      history.location.pathname === "/signup"
    ) {
      setIsAuthenticationPage(true);
    }
    const unlisten = history.listen((location) => {
      if (location.pathname === "/login" || location.pathname === "/signup") {
        setIsAuthenticationPage(true);
      } else {
        setIsAuthenticationPage(false);
      }
    });
    return () => {
      unlisten();
    };
  });

  useEffect(() => {
    ReadUser(localStorage["books_user_secret_token"], (res) => {
      if (!res.error && res.user) {
        store.dispatch({
          type: "SET_USER",
          user: Object.assign({}, res.user, { authorizationTried: true }),
        });
      } else {
        store.dispatch({
          type: "SET_AUTHORIZATION_TRIED",
        });
      }
    });
  }, []);

  const FindGroup = () => {
    const [filter, setFilter] = useState({ interested_genres: "" });
    const [groups, setGroups] = useState([]);
    useEffect(() => {
      GetFilteredGroups({}, (res) => {
        if (res.groups) {
          setGroups(res.groups);
        }
      });
    }, []);
    return (
      <div className="row no-gutters justify-content-center">
        <div className="col-12 col-sm-11 col-md-10 col-lg-8 col-xl-7 p-3">
          <div className="row no-gutters static-card bg-white p-4">
            <div className="col-12 col-md mr-4 my-2">
              <div className="row no-gutters flex-center position-relative">
                <BsSearch
                  style={{
                    zIndex: 2,
                    position: "absolute",
                    left: "18px",
                    top: 0,
                    bottom: 0,
                    margin: "auto",
                  }}
                ></BsSearch>
                <input
                  spellCheck={false}
                  type="text"
                  value={filter.interested_genres}
                  onKeyUp={(e) => {
                    e.persist();
                    if (e.keyCode === 13) {
                      GetFilteredGroups(
                        filter.interested_genres ? filter : {},
                        (res) => {
                          if (res.groups) {
                            setGroups(res.groups);
                          } else {
                          }
                        }
                      );
                    }
                  }}
                  onChange={(e) => {
                    e.persist();
                    setFilter((prev) =>
                      Object.assign({}, prev, {
                        interested_genres: e.target.value,
                      })
                    );
                  }}
                  className="main-search-input col-12"
                ></input>
              </div>
            </div>
            <div
              className="col-auto fb-btn-success my-2"
              onClick={() => history.push("/create-group")}
            >
              <BsPlus className="mr-2" fontSize="24px"></BsPlus>
              Create group
            </div>
          </div>
          {groups.length ? (
            groups.map((x) => (
              <div className="row no-gutters py-2">
                <div className="col-12">
                  <div className="row no-gutters p-4 bg-white static-card">
                    <div className="col-auto mr-4">
                      <div
                        style={{ width: "100px", height: "100px" }}
                        className="d-flex flex-center alert-secondary rounded"
                      >
                        <BsImage fontSize="45px"></BsImage>
                      </div>
                    </div>
                    <div className="col d-flex flex-column justify-content-between">
                      <div
                        className="row no-gutters h5 cursor-pointer"
                        onClick={() => history.push(`/groups/${x._id}`)}
                      >
                        {x.name}
                      </div>
                      <div className="row no-gutters">
                        <label className="col-12">Interested genres</label>
                        <div className="col-12">
                          <div className="row no-gutters">
                            {x.interested_genres.length
                              ? x.interested_genres.map((y) => (
                                  <div
                                    className="p-2 static-card border col-auto mr-2 mb-2"
                                    key={uid(y)}
                                  >
                                    <div className="row no-gutters align-items-center">
                                      <div className="col-auto mr-2">{y}</div>
                                    </div>
                                  </div>
                                ))
                              : "Empty"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="row no-gutters p-5 bg-white static-card">
              No groups intereseted in "{filter.interested_genres}"
            </div>
          )}
        </div>
      </div>
    );
  };

  const Redirecter = ({ user }) => {
    useEffect(() => {
      if (user.authorizationTried || user._id) {
        if (user._id) {
          if (user.groupMember && user.groupMember.group_id) {
            history.push(`/groups/${user.groupMember.group_id}`);
          } else {
            history.push("/find-group");
          }
        } else {
          history.push("/login");
        }
      }
    }, [user]);
    return (
      <div className="row no-gutters flex-center" style={{ height: "500px" }}>
        <PuffLoader size={105} color="#f88888"></PuffLoader>
      </div>
    );
  };

  function mapp(state, ownProps) {
    return {
      user: state.user,
      ...ownProps,
    };
  }

  const connectedRedirecter = connect(mapp)(Redirecter);

  return (
    <Provider store={store}>
      <Router history={history}>
        <div className="container-fluid d-flex flex-column h-100 px-0 bg-light">
          <div className="row no-gutters" style={{ flex: "0 0 auto" }}>
            <div className="col-12">
              {!isAuthenticationPage && (
                <React.Fragment>
                  <Navbar
                    setMenu={setMenu}
                    isMenuOpened={isMenuOpened}
                  ></Navbar>
                  <BreadCrumbs></BreadCrumbs>
                </React.Fragment>
              )}
            </div>
          </div>
          <div
            className="row no-gutters overflow-auto"
            style={{ flex: "1 1 auto", position: "relative" }}
          >
            <SideNavbar
              isMenuOpened={isMenuOpened}
              setMenu={setMenu}
            ></SideNavbar>
            <div
              className="w-100 h-100"
              style={{
                transition: "opacity 0.3s",
                position: "fixed",
                top: "62px",
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
                <Route exact path="/" component={connectedRedirecter} />
                <Route exact path="/login" component={Login} />
                <Route exact path="/find-group" component={FindGroup} />
                <Route exact path="/new-quiz" component={CreateQuizForm} />
                <PrivateRoute
                  bearerPath="/login"
                  exact
                  path="/groups/:groupId/invitations/:invitationToken"
                  Component={Group}
                />
                <Route exact path="/groups/:groupId" component={Group} />
                <Route exact path="/create-group" component={CreateGroupForm} />
                <Route exact path="/signup" component={Signup}></Route>
                <Route exact path="/profile" component={Profile}></Route>
                <PrivateRoute
                  bearerPath="/login"
                  exact
                  path="/books/:bookId/quiz/new"
                  Component={CreateQuizForm}
                ></PrivateRoute>
                <PrivateRoute
                  bearerPath="/login"
                  exact
                  path="/books/:bookId/quiz/:quizId"
                  Component={Quiz}
                ></PrivateRoute>
                <PrivateRoute
                  bearerPath="/login"
                  exact
                  path="/books/:bookId/quiz/:quizId"
                  Component={Quiz}
                ></PrivateRoute>
                <PrivateRoute
                  bearerPath="/login"
                  exact
                  path="/books/:bookId/summaries/new"
                  Component={WriteSummaryForm}
                ></PrivateRoute>
                <Route
                  exact
                  path="/books/:bookId/summaries/:summaryId/edit"
                  component={SummaryEditForm}
                ></Route>
                <Route
                  exact
                  path="/books/:bookId/summaries/:summaryId"
                  component={Summary}
                ></Route>
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
        <Toast></Toast>
        <ToastContainer />
      </Router>
    </Provider>
  );
}

export default App;
