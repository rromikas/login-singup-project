import React, { useState, useRef, useEffect } from "react";
import history from "../../routing/history";
import { connect } from "react-redux";
import store from "../../store/store";
import { BsBell, BsSearch } from "react-icons/bs";
import { GetNotifications } from "../../api/socket-requests";
import Popover from "../utility/Popover";
import { format } from "timeago.js";

const Navbar = ({ user, isMenuOpened, setMenu }) => {
  const searchBar = useRef(null);
  const notificationsPopover = useRef(null);
  const [query, setQuery] = useState("");
  const [notifications, setNotifications] = useState([]);
  useEffect(() => {
    if (user._id) {
      GetNotifications(user._id, (res) => {
        console.log("Notifications", res.notifications);
        setNotifications(res.notifications);
      });
    }
  }, [user]);
  return user.authorizationTried || user._id ? (
    <div className="row no-gutters p-2 bg-white border align-items-center">
      <div className="col-auto d-flex d-md-none align-items-center pl-2 pr-3">
        <div
          className={`menu-btn${isMenuOpened ? " open" : ""}`}
          onClick={() => setMenu(!isMenuOpened)}
        >
          <div className="menu-btn__burger"></div>
        </div>
      </div>
      <div className="col-auto d-none d-md-flex pr-lg-5 pr-md-3">
        <div className="fb-btn" onClick={() => history.push("/")}>
          Home
        </div>
        <div className="fb-btn" onClick={() => history.push("/search")}>
          Search
        </div>
        <div className="fb-btn" onClick={() => history.push("/add-book")}>
          Add book
        </div>
      </div>
      <div className="col pr-1 d-flex align-items-center pr-lg-5 pr-md-3">
        <div className="row no-gutters w-100 align-items-center position-relative">
          <BsSearch
            style={{
              zIndex: 5,
              position: "absolute",
              left: "18px",
              top: 0,
              bottom: 0,
              margin: "auto",
            }}
          ></BsSearch>
          <input
            className="col mr-2 main-search-input"
            type="text"
            ref={searchBar}
            value={query}
            onKeyDown={(e) => {
              e.persist();
              if (e.keyCode === 13) {
                history.push(`/search/${query}`);
                searchBar.current.blur();
              }
            }}
            onChange={(e) => {
              e.persist();
              setQuery(e.target.value);
            }}
            spellCheck={false}
          ></input>
        </div>
      </div>

      <div className="col-auto pl-1">
        {user.email !== "" ? (
          <div className="row no-gutters align-items-center">
            <Popover
              content={
                <div
                  className="p-2"
                  style={{ maxHeight: "400px", overflow: "auto" }}
                >
                  {notifications.map((x) => (
                    <div
                      className="d-flex flex-wrap notification-item"
                      onClick={() => {
                        notificationsPopover.current.click();
                        history.push(x.link);
                      }}
                    >
                      <div className="col-auto p-2">
                        <div
                          className="bg-image rounded-circle square-60"
                          style={{
                            backgroundImage: `url(${
                              x.sender_id
                                ? x.sender_id.photo
                                  ? x.sender_id.photo
                                  : ""
                                : ""
                            })`,
                          }}
                        ></div>
                      </div>
                      <div className="col px-2 text-left py-4">
                        <div className="row no-gutters mb-1">
                          <span className="font-weight-bold mr-1">
                            {x.sender_id
                              ? x.sender_id.name
                                ? x.sender_id.name
                                : ""
                              : ""}
                          </span>
                          {` ${x.message}`}
                        </div>
                        <div className="row no-gutters text-primary">
                          {format(x.date)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              }
            >
              <div
                className="col-auto mr-2 fb-btn position-relative"
                ref={notificationsPopover}
              >
                <div
                  className="position-absolute bg-primary d-flex flex-center"
                  style={{
                    width: "18px",
                    height: "18px",
                    borderRadius: "50%",
                    zIndex: 5,
                    top: "1px",
                    right: "14px",
                    fontSize: "12px",
                    color: "white",
                  }}
                >
                  {notifications.length}
                </div>
                <BsBell fontSize="18px"></BsBell>
              </div>
            </Popover>
            <div className="col-auto">
              <div
                onClick={() => history.push("/profile")}
                className="border mr-1 cursor-pointer"
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  backgroundImage: `url(${user.photo})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              ></div>
            </div>
          </div>
        ) : (
          <div className="d-flex">
            <div
              className="mr-1 fb-btn-pro"
              onClick={() => history.push("/login")}
            >
              Login
            </div>
            <div
              className="d-none fb-btn d-sm-block"
              onClick={() => history.push("/signup")}
            >
              Sign Up
            </div>
          </div>
        )}
      </div>
    </div>
  ) : (
    <div></div>
  );
};

function mapStateToProps(state, ownProps) {
  return {
    user: state.user,
    isMenuOpened: state.isMenuOpened,
    ...ownProps,
  };
}

export default connect(mapStateToProps)(Navbar);
