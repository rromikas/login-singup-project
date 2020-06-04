import React from "react";
import Facebook from "../social/facebook";
import Google from "../social/google";
import BoyReading from "../../images/boyReading";
import EmailForm from "./emailForm";
import history from "../../routing/history";
import { FaAngleLeft } from "react-icons/fa";

const Signup = (props) => {
  const successPath = props?.location?.state?.successPath
    ? props.location.state.successPath
    : "/login";
  return (
    <div
      className="row no-gutters justify-content-center align-items-center shift bg-light"
      style={{ position: "relative" }}
    >
      <div
        onClick={() => history.push("/")}
        className="convex py-2 px-3 rounded-40 cursor-pointer d-none d-md-block"
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          zIndex: 5,
          color: "white",
        }}
      >
        <FaAngleLeft></FaAngleLeft> Back to home
      </div>
      <div
        className="col py-3 d-none d-md-block"
        style={{
          paddingLeft: "80px",
          paddingRight: "80px",
          background:
            "radial-gradient(circle at left, rgb(255, 140, 140), rgba(255, 140, 140, 0.5))",
        }}
      >
        <div className="w-90">
          <BoyReading></BoyReading>
        </div>
      </div>
      <div
        className="col-12 col-sm-9 col-md-6 py-4 px-5 bg-light"
        style={{ maxWidth: "400px" }}
      >
        <div className="row no-gutters mb-3 d-flex d-md-none">
          <div
            onClick={() => history.push("/")}
            className="convex py-2 px-3 rounded-40 cursor-pointer col-auto mx-auto"
          >
            <FaAngleLeft></FaAngleLeft> Back to home
          </div>
        </div>
        <div className="mb-3">
          <Facebook
            text="Sign Up with Facebook"
            successPath={successPath}
          ></Facebook>
        </div>
        <div>
          <Google text="Sign Up with Google" successPath={successPath}></Google>
        </div>
        <hr className="mt-4"></hr>
        <EmailForm successPath={"/login"}></EmailForm>
        <div className="text-center mt-2">
          Already have an account?
          <span
            className="btn-link"
            onClick={() => {
              history.push("/login");
            }}
            style={{ color: "#ff8c8c", cursor: "pointer" }}
          >
            {" "}
            Login
          </span>
        </div>
      </div>
    </div>
  );
};

export default Signup;
