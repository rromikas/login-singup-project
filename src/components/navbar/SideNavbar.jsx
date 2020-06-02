import React from "react";
import { connect } from "react-redux";
import history from "../../routing/history";

const SideNavbar = ({ isMenuOpened, setMenu }) => {
  return (
    <div
      className="col-md-3 col-sm-7 col-12 vh-100"
      style={{ position: "absolute" }}
    >
      <div className="w-100 h-100" style={{ position: "relative" }}>
        <div
          className="container pt-3 px-4"
          style={{
            height: "100%",
            width: "100%",
            left: isMenuOpened ? 0 : "-100%",
            transition: "left 0.3s",
            position: "absolute",
            zIndex: 5,
            background: "white",
          }}
        >
          <div
            className="py-3 menu-item-custom"
            onClick={() => {
              setMenu(!isMenuOpened);
              history.push("/");
            }}
          >
            Home
          </div>
          <div
            className="py-3 menu-item-custom"
            onClick={() => {
              setMenu(!isMenuOpened);
              history.push("/search");
            }}
          >
            Search
          </div>
          <div
            className="py-3 menu-item-custom"
            onClick={() => {
              setMenu(!isMenuOpened);
              history.push("/add-book");
            }}
          >
            Add book
          </div>
        </div>
      </div>
    </div>
  );
};

function mapStateToProps(state, ownProps) {
  return {
    isMenuOpened: state.isMenuOpened,
    ...ownProps,
  };
}

export default connect(mapStateToProps)(SideNavbar);
