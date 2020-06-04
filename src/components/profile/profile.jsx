import React, { useState, useRef, useEffect } from "react";
import { FaEdit, FaCheck, FaCamera } from "react-icons/fa";
import RelaxReading from "../../images/relaxReading";
import { ReadUser, UpdateUser } from "../../api/socket-requests";
import PhotoUploader from "./photoUploader";
import history from "../../routing/history";
import { toast } from "react-toastify";
import Results from "../search/results";
import store from "../../store/store";
import Summaries from "./Summaries";

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
    ReadUser(localStorage["secret_token"], (res) => {
      if (res.error) {
        toast.error(
          "Fetch failed. Configure your origin url variable in javascript/requests.js file"
        );
        history.push("/login");
      } else {
        setUser((user) => Object.assign({}, user, res.user));
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
        className="col-12 col-sm-4 bg-light px-sm-4 px-3 py-4"
        style={{
          minHeight: "45vh",
          background:
            "radial-gradient(circle at left, rgb(255, 140, 140), rgba(255, 140, 140, 0.5))",
        }}
      >
        <div className="row no-gutters justify-content-center mt-4">
          <div className="col-12">
            <div
              className="rounded-circle mx-auto"
              style={{
                width: "120px",
                height: "120px",
                background: "white",
                overflow: "hidden",
                position: "relative",
                backgroundImage:
                  user.photo !== "" ? `url(${user.photo})` : "unset",
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
          <div className="col-12 mx-2 ml-md-3 mr-md-3">
            <div className="text-center mt-3 h1" style={{ color: "white" }}>
              {user.name}
            </div>
          </div>
        </div>
      </div>
      <div className="col-12 col-sm-8 px-4 py-4">
        <div className="d-flex align-items-center px-2">
          <div className="h1">Intro</div>
          <div className="mx-3">
            {editIntro ? (
              <FaCheck
                className="pointer font-light"
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
                className="pointer font-light"
                fontSize="24px"
                onClick={() => setEditIntro(true)}
              ></FaEdit>
            )}
          </div>
        </div>
        <textarea
          spellCheck={false}
          disabled={!editIntro}
          className={`${
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
        ></textarea>
        <div className="mb-5">
          <Results
            results={{
              items: user.favoriteBooks,
              title: "Favorite books",
            }}
          ></Results>
        </div>
        {/* ) : (
        <div
          className="w-100 d-none d-md-flex pr-4 justify-content-end mt-5 pb-2"
          style={{ height: "55vh" }}
        >
          <RelaxReading></RelaxReading>
        </div> */}
        <Summaries summaries={user.summaries}></Summaries>
      </div>
    </div>
  );
};

export default Profile;
