import React from "react";
import Facebook from "../social/facebook";
import Google from "../social/google";
import BoyReading from "../../images/boyReading";
import EmailForm from "./emailForm";
import history from "../../routing/history";
import { toast } from "react-toastify";
import { signup } from "../../api/requests";

const Signup = (props) => {
  const successPath = props?.location?.state?.successPath
    ? props.location.state.successPath
    : "/login";
  return (
    <div
      className="w-100 overflow-auto bg-theme px-2 py-4"
      style={{ minHeight: "100%" }}
    >
      <div
        style={{ maxWidth: "1200px", borderRadius: "15px", overflow: "hidden" }}
        className="container-fluid shift"
      >
        <div className="row justify-content-center align-items-center shift bg-light">
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
            <div className="mb-3">
              <Facebook
                text="Sign Up with Facebook"
                successPath={successPath}
              ></Facebook>
            </div>
            <div>
              <Google
                text="Sign Up with Google"
                successPath={successPath}
              ></Google>
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
      </div>
    </div>
  );
};

export default Signup;
