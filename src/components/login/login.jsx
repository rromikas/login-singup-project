import React from "react";
import Facebook from "../social/facebook";
import Google from "../social/google";
import GirlReading from "../../images/girlReading";
import EmailForm from "./emailForm";
import history from "../../routing/history";

const Login = (props) => {
  const successPath = props?.location?.state?.successPath
    ? props.location.state.successPath
    : "/";
  console.log("SUCESS PATH LOGIN", successPath);
  return (
    <div
      className="w-100 overflow-auto bg-theme py-4 px-2"
      style={{ minHeight: "100%" }}
    >
      <div
        style={{ maxWidth: "1200px", borderRadius: "15px", overflow: "hidden" }}
        className="container-fluid shift"
      >
        <div className="row justify-content-center bg-light">
          <div
            className="col py-3 d-none d-md-block image-bg-theme"
            style={{
              paddingLeft: "80px",
              paddingRight: "80px",
            }}
          >
            <GirlReading></GirlReading>
          </div>
          <div
            className="col-12 col-sm-9 col-md-6 p-5 bg-light"
            style={{ maxWidth: "400px" }}
          >
            <div className="mb-3">
              <Facebook
                text="Login with Facebook"
                successPath={successPath}
              ></Facebook>
            </div>
            <div>
              <Google
                text="Login with Google"
                successPath={successPath}
              ></Google>
            </div>
            <div
              style={{
                width: "40px",
                height: "40px",
              }}
              className="soft-box d-flex justify-content-center align-items-center mx-auto mt-4 mb-1 p-4"
            >
              Or
            </div>
            <EmailForm successPath={successPath}></EmailForm>
            <div className="text-center mt-3">
              Forgot password?
              <span
                className="btn-link"
                onClick={() => {
                  history.push({ pathname: "/signup" });
                }}
                style={{ color: "#ff8c8c", cursor: "pointer" }}
              >
                {" "}
                Remind
              </span>
            </div>
            <div className="text-center">
              Don't have an account?
              <span
                className="btn-link"
                onClick={() => {
                  history.push("/signup", {
                    successPath,
                  });
                }}
                style={{ color: "#ff8c8c", cursor: "pointer" }}
              >
                {" "}
                Sign Up
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
