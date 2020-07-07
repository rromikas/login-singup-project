import React, { useState, useRef } from "react";
import Popover from "../utility/popover";
import { connect } from "react-redux";
import { uid } from "react-uid";
import { BsX } from "react-icons/bs";
import history from "../../routing/history";
import { CreateGroup } from "../../api/socket-requests";
import store from "../../store/store";

const CreateGroupForm = ({ user }) => {
  const genresAdder = useRef(null);
  const [group, setGroup] = useState({
    interested_genres: [],
    name: "",
    description: "",
    create_user: user._id,
    create_date: Date.now(),
  });
  const [problem, setProblem] = useState("");
  const [newGenre, setNewGenre] = useState("");
  return (
    <div className="row no-gutters justify-content-center p-3">
      <div className="col-12 col-xl-9 col-lg-10 p-5 static-card bg-white">
        <div className="row no-gutters">
          <div className="col-12 h2">Create group</div>
          <div className="col-12">
            <div className="row no-gutters mb-2">
              <div className="col-8">
                <label>Name</label>
                <input
                  spellCheck={false}
                  type="text"
                  className="w-100 general-input"
                  value={group.name}
                  onChange={(e) => {
                    e.persist();
                    setGroup((prev) =>
                      Object.assign({}, prev, { name: e.target.value })
                    );
                  }}
                ></input>
              </div>
            </div>
            <div className="row no-gutters mb-2">
              <div className="col-8">
                <label>Description</label>
                <textarea
                  spellCheck={false}
                  value={group.description}
                  onChange={(e) => {
                    e.persist();
                    setGroup((prev) =>
                      Object.assign({}, prev, { description: e.target.value })
                    );
                  }}
                  type="text"
                  style={{ height: "250px" }}
                  className="w-100"
                ></textarea>
              </div>
            </div>

            <div className="row no-gutters mb-4">
              <label className="col-12">Interested genres</label>
              {group.interested_genres.length ? (
                group.interested_genres.map((x, i) => (
                  <div
                    className="p-2 basic-card col-auto mb-2 mr-2"
                    key={uid(x)}
                  >
                    <div className="row no-gutters align-items-center">
                      <div className="col-auto mr-2">{x}</div>
                      <BsX
                        className="col-auto"
                        fontSize="18px"
                        onClick={() => {
                          let arr = [...group.interested_genres];
                          arr.splice(i, 1);
                          setGroup((prev) =>
                            Object.assign({}, prev, { interested_genres: arr })
                          );
                        }}
                      ></BsX>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-2 border col-auto mb-2 mr-2 rounded">
                  No interested genres added
                </div>
              )}
              <div className="col-12">
                <div className="row no-gutters">
                  <Popover
                    position="top"
                    content={
                      <div className="popover-inner p-2">
                        <div className="mb-2 popover-title">Add genre</div>
                        <div className="row no-gutters mb-2">
                          <input
                            value={newGenre}
                            onChange={(e) => {
                              e.persist();
                              setNewGenre(e.target.value);
                            }}
                            onKeyUp={(e) => {
                              if (e.keyCode === 13) {
                                let arr = [...group.interested_genres];
                                setGroup((prev) =>
                                  Object.assign({}, prev, {
                                    interested_genres: arr.concat(newGenre),
                                  })
                                );
                                setNewGenre("");
                                genresAdder.current.click();
                              }
                            }}
                            className="col-12 general-input"
                            type="text"
                            placeholder="enter genre"
                            spellCheck={false}
                          ></input>
                        </div>
                        <div className="row no-gutters justify-content-center">
                          <div
                            className="btn-pro col-auto mr-2"
                            onClick={() => {
                              let arr = [...group.interested_genres];
                              setGroup((prev) =>
                                Object.assign({}, prev, {
                                  interested_genres: arr.concat(newGenre),
                                })
                              );
                              setNewGenre("");
                              genresAdder.current.click();
                            }}
                          >
                            Add
                          </div>
                          <div
                            className="btn col-auto"
                            onClick={() => genresAdder.current.click()}
                          >
                            Cancel
                          </div>
                        </div>
                      </div>
                    }
                  >
                    <div className="col-auto fb-btn-pro mb-2" ref={genresAdder}>
                      Add genre
                    </div>
                  </Popover>
                </div>
              </div>
            </div>
            {problem ? (
              <div className="row no-gutters">
                <label className="text-danger">{problem}</label>
              </div>
            ) : (
              ""
            )}
            <div className="row no-gutters">
              <div
                className="col-auto fb-btn-primary mr-2"
                onClick={() => {
                  if (group.name) {
                    CreateGroup(group, (res) => {
                      console.log("reasponse after creating group", res);
                      if (res.erorr) {
                        setProblem(res.error);
                      } else {
                        store.dispatch({
                          type: "UPDATE_USER",
                          user: { groupMember: res.member },
                        });
                        history.push(`/groups/${res.group._id}`);
                      }
                    });
                  } else {
                    setProblem("group name is required");
                  }
                }}
              >
                Create
              </div>
              <div
                className="col-auto fb-btn-pro"
                onClick={() => history.goBack()}
              >
                Cancel
              </div>
            </div>
          </div>
        </div>
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

export default connect(mapp)(CreateGroupForm);
