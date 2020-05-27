import React, { useState } from "react";
import history from "../routing/history";
import { useSelector } from "react-redux";
import store from "../store/store";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import { uid } from "react-uid";
const UserMenu = () => {
  const user = useSelector((state) => state.user);
  const [showAll, setShowAll] = useState(false);
  const menu = [
    {
      name: "Profile",
      action: () => {
        history.push("/profile");
      },
      eligible: user.email !== "",
    },
    {
      name: "Add book",
      action: () => {
        history.push("/add-book");
      },
      eligible: user.email !== "",
    },
    {
      name: "Logout",
      action: () => {
        localStorage["secret_token"] = "";
        store.dispatch({
          type: "SET_USER",
          user: { email: "", name: "", photo: "", description: "" },
        });
      },
      eligible: user.email !== "",
    },
  ];
  return (
    <div className="row no-gutters p-3 convex mb-4 bg-light border rounded-8 shn justify-content-between disable-select">
      {user.email !== "" ? (
        <div
          className="border"
          style={{
            marginRight: "15px",
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            backgroundImage: `url(${user.photo})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>
      ) : (
        <div
          className="col-auto pl-2 cursor-pointer"
          onClick={() => history.push("/login")}
        >
          Login
        </div>
      )}
      <div className="col">
        <div className="row no-gutters justify-content-end">
          {history.location.pathname === "/" ? (
            <div
              className="col-auto pl-2 cursor-pointer"
              onClick={() => history.push("/search")}
            >
              Search
            </div>
          ) : (
            <div
              className="col-auto pl-2 cursor-pointer"
              onClick={() => history.push("/")}
            >
              Home
            </div>
          )}
        </div>
      </div>
      {menu.filter((x) => x.eligible).length > 0 && (
        <div className="col-12 mx-auto" onClick={() => setShowAll(!showAll)}>
          <div className="row no-gutters justify-content-center">
            {showAll ? (
              <FaCaretUp fontSize="24px"></FaCaretUp>
            ) : (
              <FaCaretDown fontSize="24px"></FaCaretDown>
            )}{" "}
            {showAll ? "less" : "more"}
          </div>
        </div>
      )}

      {menu
        .filter((x) => x.eligible)
        .slice(0, showAll ? menu.length : 0)
        .map((x) => {
          return (
            <div
              className="col-12 d-flex align-items-center p-2 cursor-pointer"
              key={uid(x)}
              onClick={x.action}
            >
              {x.name}
            </div>
          );
        })}
    </div>
  );
};

export default UserMenu;
