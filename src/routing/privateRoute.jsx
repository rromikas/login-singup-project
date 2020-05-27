import React, { useEffect, useState } from "react";
import { Route, Redirect } from "react-router-dom";
import { readUser } from "../javascript/requests";

const PrivateRoute = ({ Component, bearerPath, ...rest }) => {
  const successPath = rest.computedMatch.url;
  const [validity, setValidity] = useState({ ready: false, valid: false });

  useEffect(() => {
    readUser(localStorage["secret_token"], (res) => {
      console.log("response", res);
      setValidity((val) =>
        Object.assign({}, val, { ready: true, valid: res.error ? false : true })
      );
    });
  }, []);

  return validity.ready ? (
    <Route
      {...rest}
      render={(props) =>
        validity.valid ? (
          <Component {...props}></Component>
        ) : (
          <Redirect
            to={{ pathname: bearerPath, state: { successPath: successPath } }}
          ></Redirect>
        )
      }
    ></Route>
  ) : (
    <div></div>
  );
};

export default PrivateRoute;