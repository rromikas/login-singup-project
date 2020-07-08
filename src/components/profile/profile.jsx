import React, { useState, useRef, useEffect } from "react";
import { FaEdit, FaCheck, FaCamera } from "react-icons/fa";
import { ReadUser, UpdateUser } from "../../api/socket-requests";
import PhotoUploader from "./photoUploader";
import history from "../../routing/history";
import { toast } from "react-toastify";
import Results from "../search/results";
import store from "../../store/store";
import Summaries from "./Summaries";
import TextareaAutosize from "react-autosize-textarea";
import { connect } from "react-redux";

const initialProfile = {
  name: "",
  photo: "",
  description: "",
  summaries: [],
  favoriteBooks: [],
};

const Profile = (props) => {
  const hiddenUploader = useRef(null);
  const [user, setUser] = useState(
    props.location.state ? props.location.state : initialProfile
  );
  const [editIntro, setEditIntro] = useState(false);

  useEffect(() => {
    ReadUser(localStorage["books_user_secret_token"], (res) => {
      if (res.error) {
        toast.error(
          "Fetch failed. Configure your origin url variable in javascript/requests.js file"
        );
        history.push("/login");
      } else {
        setUser((u) => Object.assign({}, u, res.user));
        let breadCrumbs = store.getState().breadCrumbs;
        if (breadCrumbs[breadCrumbs.length - 1].path !== `/profile`) {
          store.dispatch({
            type: "ADD_BREADCRUMB",
            breadCrumb: {
              title: "profile",
              path: `/profile`,
            },
          });
        }
      }
    });
  }, []);

  return (
    <div className="row no-gutters justify-content-center bg-light">
      <div
        className="col-12 col-md-5 col-lg-4 bg-light px-sm-4 px-3 py-4"
        style={{
          minHeight: "45vh",
        }}
      >
        <div
          className="row no-gutters justify-content-center bg-white static-card h-100 py-4"
          style={{ flexFlow: "column" }}
        >
          <div className="col-12" style={{ flex: "0 0 auto" }}>
            <div
              className="rounded-circle mx-auto border"
              style={{
                width: "120px",
                height: "120px",
                background: "white",
                overflow: "hidden",
                position: "relative",
                backgroundImage: user.photo !== "" ? `url(${user.photo})` : "",
                backgroundSize: "cover",
                backgorundPosition: "center",
              }}
            >
              <div
                className="w-100 d-flex justify-content-center img-uploader align-items-center pointer"
                onClick={() => hiddenUploader.current.click()}
              >
                <FaCamera fontSize="20px" color="white"></FaCamera>
                <PhotoUploader
                  domRef={hiddenUploader}
                  onUpload={(photo) => {
                    setUser((usr) => Object.assign({}, usr, { photo: photo }));
                    UpdateUser(
                      { photo: photo, token: localStorage["secret_token"] },
                      (res) => {}
                    );
                  }}
                ></PhotoUploader>
              </div>
            </div>
          </div>
          <div
            className="col-12 px-2 pl-md-3 pr-md-3"
            style={{ flex: "0 0 auto" }}
          >
            <div className="text-center mt-3 h1">{user.name}</div>
          </div>
          <div
            style={{ flex: "0 0 auto" }}
            className="my-3 col-auto mx-auto px-4 cursor-pointer py-2 fb-btn-pro"
            onClick={() => {
              store.dispatch({
                type: "SET_USER",
                user: {
                  email: "",
                  _id: "",
                  photo: "",
                  name: "",
                  authorizationTried: true,
                },
              });
              localStorage["books_user_secret_token"] = "";
              history.push("/");
            }}
          >
            Logout
          </div>
          <div className="col-auto px-4" style={{ flex: "0 0 auto" }}>
            <div className="row no-gutters align-items-center">
              <div className="col-12">
                <div className="row no-gutters align-items-center">
                  <div className="h4 col-auto mr-2 mb-0">Intro</div>
                  <div className="col-auto">
                    {editIntro ? (
                      <FaCheck
                        className="pointer text-dark"
                        fontSize="24px"
                        onClick={() => {
                          setEditIntro(false);
                          UpdateUser({
                            description: user.description,
                            token: localStorage["secret_token"],
                          });
                        }}
                      ></FaCheck>
                    ) : (
                      <FaEdit
                        className="pointer text-dark"
                        fontSize="24px"
                        onClick={() => setEditIntro(true)}
                      ></FaEdit>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <TextareaAutosize
              spellCheck={false}
              disabled={!editIntro}
              className={`col-12 ${
                !editIntro ? "borderless " : "brdr-light "
              }w-100 lead px-2`}
              style={{
                background: "transparent",
                height: "15vh",
                minHeight: "100px",
              }}
              value={user.description}
              onChange={(e) => {
                e.persist();
                setUser((usr) =>
                  Object.assign({}, usr, { description: e.target.value })
                );
              }}
            ></TextareaAutosize>
          </div>

          <div className="col-auto" style={{ flex: "1 1 auto" }}></div>
        </div>
      </div>
      <div className="col-12 col-md-7 col-lg-8 px-4 py-4">
        <div className="mb-5">
          <Results
            results={{
              items: user.favoriteBooks,
              title: "Favorite books",
            }}
          ></Results>
        </div>
        <Summaries summaries={user.summaries}></Summaries>
      </div>
    </div>
  );
};

function mapp(state, ownProps) {
  return {
    user: state.user,
    ...ownProps,
  };
}

export default connect(mapp)(Profile);
