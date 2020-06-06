import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import React, { useState } from "react";
import { FaFacebook } from "react-icons/fa";
import { FacebookSignup } from "../../api/socket-requests";
import history from "../../routing/history";
import { toast } from "react-toastify";
import store from "../../store/store";

const handleResponse = (response, setLoading, successPath) => {
  alert("yr");
  alert("gavo response" + response.name);
  alert(JSON.stringify(response));
  if (response && response.email) {
    setLoading(true); //showing loader to user while waiting response from server

    let newUser = {
      name: response.name,
      email: response.email,
      photoUrl: response.picture.data.url,
      accessToken: response.accessToken,
    };
    FacebookSignup(newUser, (res) => {
      setLoading(false);

      if (res.error) {
        toast.error(res.error.message ? res.error.message : res.error);
      } else {
        localStorage["secret_token"] = res.token;
        store.dispatch({ type: "SET_USER", user: res.user });
        history.push(successPath);
      }
    });
  }
};

const Facebook = ({ text, successPath }) => {
  const appId = "267059971103306";
  const [loading, setLoading] = useState(false);
  return (
    <FacebookLogin
      appId={appId}
      autoLoad={false}
      fields="name,email,picture"
      callback={(res) => {
        handleResponse(res, setLoading, successPath);
      }}
      render={(renderProps) => (
        <div
          className="soft-btn py-3 px-4 d-flex justify-content-between align-items-center shn"
          onClick={renderProps.onClick}
        >
          <div>{loading ? "Loading..." : text}</div>
          <div className="convex-2" style={{ borderRadius: "50%" }}>
            <FaFacebook fontSize="34px" color="#4267b2"></FaFacebook>
          </div>
        </div>
      )}
    ></FacebookLogin>
  );
};

export default Facebook;
