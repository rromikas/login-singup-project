import React, { useState, useRef, useEffect } from "react";
import { FaEdit, FaCheck, FaCamera } from "react-icons/fa";
import RelaxReading from "../../images/relaxReading";
import {
  updateUser,
  readUser,
  getFavoriteBooks,
} from "../../javascript/requests";
import PhotoUploader from "./photoUploader";
import history from "../../routing/history";
import { toast } from "react-toastify";
import Results from "../search/results";

const initialProfile = { name: "", photo: "", description: "" };

const Profile = (props) => {
  const hiddenUploader = useRef(null);
  const [user, setUser] = useState(
    props.location.state ? props.location.state : initialProfile
  );
  const [editIntro, setEditIntro] = useState(false);

  useEffect(() => {
    readUser(localStorage["secret_token"], (res) => {
      if (res.error) {
        toast.error(
          "Fetch failed. Configure your origin url variable in javascript/requests.js file"
        );
        history.push("/login");
      } else {
        setUser((user) => Object.assign({}, user, res.user));
      }
    });
  }, []);

  return (
    <div className="w-100 h-100 overflow-auto p-lg-4 p-0 bg-theme">
      <div
        style={{ maxWidth: "1200px", overflow: "hidden" }}
        className="container-fluid corners-theme"
      >
        <div className="row justify-content-center shift bg-light">
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
                        setUser((usr) =>
                          Object.assign({}, usr, { photo: photo })
                        );
                        updateUser({ photo: photo }, (res) => {});
                      }}
                    ></PhotoUploader>
                  </div>
                </div>
              </div>
              <div className="col-12 mx-2 ml-md-3 mr-md-3">
                <div className="text-center mt-3 h1" style={{ color: "white" }}>
                  {user.name}
                </div>
                <div className="text-center lead" style={{ color: "white" }}>
                  Member since 2018
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-8 px-md-4 px-sm-3 px-2 py-4">
            <div className="d-flex align-items-center px-2">
              <h1 className="mt-3">Intro</h1>
              <div className="mx-3">
                {editIntro ? (
                  <FaCheck
                    className="pointer font-light"
                    fontSize="24px"
                    onClick={() => {
                      setEditIntro(false);
                      updateUser({ description: user.description });
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

            {user.favoriteBooks?.length > 0 ? (
              <div>
                <Results
                  results={{
                    items: user.favoriteBooks.map((x) => x.book),
                    title: "Favorite books",
                  }}
                ></Results>
              </div>
            ) : (
              <div
                className="w-100 d-none d-md-flex pr-4 justify-content-end mt-5 pb-2"
                style={{ height: "55vh" }}
              >
                <RelaxReading></RelaxReading>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
