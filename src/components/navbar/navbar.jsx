import React, { useState } from "react";
import history from "../../routing/history";
import { connect } from "react-redux";
import store from "../../store/store";
import { FaSearch } from "react-icons/fa";

const Navbar = ({ user, isMenuOpened, setMenu }) => {
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
        <div className="btn btn-outline-primary mr-1">Home</div>
        <div className="btn mr-1">Search</div>
        <div className="btn mr-1" onClick={() => history.push("/add-book")}>
          Add book
        </div>
      </div>
      <div className="col pr-1 d-flex align-items-center">
        <input
          value={query}
          onKeyDown={(e) => {
            e.persist();
            if (e.keyCode === 13) {
              history.push("/search");
              store.dispatch({ type: "SET_QUERY", query: query });
            }
          }}
          onChange={(e) => {
            e.persist();
            setQuery(e.target.value);
          }}
          className="w-100 form-control shn convex"
          spellCheck={false}
          placeholder="Search by the title, isbn, author, genre . . ."
        ></input>
      </div>
      <div className="col-auto pr-lg-5 pr-md-3 d-none d-md-flex">
        <div
          className="btn btn-outline-primary convex"
          onClick={() => {
            history.push("/search");
            store.dispatch({ type: "SET_QUERY", query: query });
          }}
        >
          Search
        </div>
      </div>
      <div
        className="col-auto d-flex d-md-none align-items-center pr-2 mx-1 rounded"
        style={{ color: "#f88888" }}
      >
        <FaSearch fontSize="20px"></FaSearch>
      </div>
      <div className="col-auto">
        {user.email !== "" ? (
          <div
            onClick={() => history.push("/profile")}
            className="border mr-1"
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
          <div>
            <div className="btn mr-1">Login</div>
            <div className="btn btn-outline-primary">Sign Up</div>
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
