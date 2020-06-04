import React, { useState, useRef } from "react";
import history from "../../routing/history";
import { connect } from "react-redux";
import store from "../../store/store";
import { FaSearch } from "react-icons/fa";

const Navbar = ({ user, isMenuOpened, setMenu }) => {
  const searchBar = useRef(null);
  const [query, setQuery] = useState("");
  return (
    <div className="row no-gutters py-3 px-1 p-sm-2 p-md-3 bg-white border">
      <div className="col-auto d-flex d-md-none align-items-center pl-2 pr-3">
        <div
          className={`menu-btn${isMenuOpened ? " open" : ""}`}
          onClick={() => setMenu(!isMenuOpened)}
        >
          <div className="menu-btn__burger"></div>
        </div>
      </div>
      <div className="col-auto d-none d-md-flex pr-lg-5 pr-md-3">
        <div
          className="btn btn-outline-primary mr-1"
          onClick={() => history.push("/")}
        >
          Home
        </div>
        <div className="btn mr-1" onClick={() => history.push("/search")}>
          Search
        </div>
        <div className="btn mr-1" onClick={() => history.push("/add-book")}>
          Add book
        </div>
      </div>
      <div className="col pr-1 d-flex align-items-center pr-lg-5 pr-md-3">
        <div className="input-group">
          <input
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
            style={{ paddingTop: "19px", paddingBottom: "19px" }}
            className="form-control shn"
            spellCheck={false}
            placeholder={
              window.innerWidth > 457
                ? "Search by the title, isbn, author, genre . . ."
                : "Search"
            }
          ></input>
          <div
            className="input-group-append"
            onClick={() => {
              history.push(`/search/${query}`);
            }}
          >
            <span
              onClick={() => searchBar.current.blur()}
              className="bg-white input-group-text btn btn-outline-primary d-sm-block d-none"
              id="basic-addon2"
              style={{ borderRadius: "0 5px 5px 0" }}
            >
              Search
            </span>
            <span
              className="input-group-text btn bg-white d-block d-sm-none"
              style={{
                borderRadius: "0 5px 5px 0",
                border: "2px solid #f88888",
              }}
            >
              <FaSearch fontSize="20px" color="#f88888"></FaSearch>
            </span>
          </div>
        </div>
      </div>

      <div className="col-auto">
        {user.email !== "" ? (
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
        ) : (
          <div className="d-flex">
            <div className="btn mr-1" onClick={() => history.push("/login")}>
              Login
            </div>
            <div
              className="btn btn-outline-primary d-none d-sm-block"
              onClick={() => history.push("/signup")}
            >
              Sign Up
            </div>
          </div>
        )}
      </div>
    </div>
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
