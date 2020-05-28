import { GoogleLogin } from "react-google-login";
import React, { useState } from "react";
import GoogleIcon from "./googleIcon";
import { GoogleSignup } from "../../api/socket-requests";
import history from "../../routing/history";
import { toast } from "react-toastify";
import store from "../../store/store";

const handleResponse = (response, setLoading, successPath) => {
  var user = {
    accessToken: response.accessToken,
    name: response.profileObj.name,
    photoUrl: response.profileObj.imageUrl,
    email: response.profileObj.email,
  };

  setLoading(true); //show loading for user while waiting response from server

  GoogleSignup(user, (res) => {
    setLoading(false); // hide loader

    if (res.error) {
      toast.error(res.error.message ? res.error.message : res.error);
    } else {
      localStorage["secret_token"] = res.token;
      store.dispatch({ type: "SET_USER", user: res.user });
      history.push(successPath);
    }
  });
};

const Google = ({ text, successPath }) => {
  const clientId =
    "49004644590-v8t3iamk2h7a6r3flrkn3cjor47hrlkn.apps.googleusercontent.com";
  const [loading, setLoading] = useState(false);
  return (
    <GoogleLogin
      clientId={clientId}
      buttonText="Login"
      render={(renderProps) => (
        <div
          onClick={renderProps.onClick}
          disabled={renderProps.disabled}
          className="soft-btn py-3 px-4 d-flex justify-content-between align-items-center shn"
        >
          <div>{loading ? "Loading..." : text}</div>
          <div className="convex-2" style={{ borderRadius: "50%" }}>
            <GoogleIcon size={32}></GoogleIcon>
          </div>
        </div>
      )}
      onSuccess={(res) => {
        handleResponse(res, setLoading, successPath);
      }}
      cookiePolicy={"single_host_origin"}
    />
  );
};

export default Google;
