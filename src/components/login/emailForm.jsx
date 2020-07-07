import React, { useState } from "react";
import { Login } from "../../api/socket-requests";
import history from "../../routing/history";
import store from "../../store/store";

const handleSubmit = (e, onError, setLoading, successPath) => {
  e.preventDefault();
  setLoading(true);
  let newUser = {};
  const formData = new FormData(e.target);
  for (var [key, value] of formData.entries()) {
    newUser[key] = value;
  }

  Login(newUser, (res) => {
    setLoading(false);
    if (res.error) {
      onError(res.error.message ? res.error.message : res.error);
    } else {
      localStorage["books_user_secret_token"] = res.token;
      store.dispatch({ type: "SET_USER", user: res.user });
      history.push(successPath);
    }
  });
};

const EmailForm = ({ successPath }) => {
  const [error, setError] = useState("none");
  const [loading, setLoading] = useState(false);
  return (
    <form onSubmit={(e) => handleSubmit(e, setError, setLoading, successPath)}>
      <label htmlFor="email">Email</label>
      <input
        name="email"
        className="round-input mb-2 shn px-4"
        id="email"
        type="email"
        required
      ></input>
      <label htmlFor="password">Password</label>
      <input
        name="password"
        type="password"
        className="round-input shn px-4"
        id="password"
        required
        pattern=".{6,}"
      ></input>
      <button
        type="submit"
        className={`soft-btn mt-4${error !== "none" ? " reject" : ""}`}
        style={{ color: "white", background: "#ff8c8c" }}
      >
        {loading ? "loading..." : "Login"}
      </button>
      <div
        className="mt-2 text-center"
        style={{ color: "red", opacity: error !== "none" ? 1 : 0 }}
      >
        {error}
      </div>
    </form>
  );
};

export default EmailForm;
