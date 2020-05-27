import React, { useState } from "react";
import { login } from "../../javascript/requests";
import history from "../../routing/history";

const handleSubmit = (e, onError, setLoading) => {
  e.preventDefault();
  setLoading(true);
  let user = {};
  const formData = new FormData(e.target);
  for (var [key, value] of formData.entries()) {
    user[key] = value;
  }

  login(user, (res) => {
    setLoading(false);
    if (res.error) {
      onError(res.error.message ? res.error.message : res.error);
    } else {
      localStorage["secret_token"] = res.token;
      history.push("/profile", res.user);
    }
  });
};

const EmailForm = () => {
  const [error, setError] = useState("none");
  const [loading, setLoading] = useState(false);
  return (
    <form onSubmit={(e) => handleSubmit(e, setError, setLoading)}>
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
