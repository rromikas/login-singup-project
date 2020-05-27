import React, { Children } from "react";
import history from "../../routing/history";

const Navbar = (props) => {
  return (
    <div className="row no-gutters py-3 bg-light">
      <div className="col-lg-3 col-md-4 col-sm-5 d-flex">
        <div className="px-3">Login</div>
        <div className="px-3">Search</div>
        <div className="px-3">Add Book</div>
      </div>

      <div className="col-md-8 col-lg-9 col-sm-7 px-md-4 px-sm-3 px-2">
        {props.children}
      </div>
    </div>
  );
};

export default Navbar;
