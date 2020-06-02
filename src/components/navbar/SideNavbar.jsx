import React from "react";
import { connect } from "react-redux";

const SideNavbar = ({ isMenuOpened }) => {
  return (
    <div
      className="col-md-3 col-sm-7 col-12 h-100"
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
          <div className="py-3 menu-item-custom">Home</div>
          <div className="py-3 menu-item-custom">Search</div>
          <div className="py-3 menu-item-custom">Add book</div>
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
