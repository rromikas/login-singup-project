import React from "react";
import { useEffect, useState, useRef } from "react";
import {
  GetGroup,
  VoteForNextBook,
  CompleteBookReading,
  UpdateGroup,
  InviteMemberToGroup,
  CheckInvitationValidity,
  AcceptInvitationToGroup,
} from "../../api/socket-requests";
import { connect } from "react-redux";
import Popover from "../utility/popover";
import {
  BsImage,
  BsStar,
  BsStarFill,
  BsThreeDots,
  BsCheck,
} from "react-icons/bs";
import store from "../../store/store";
import history from "../../routing/history";
import PhotoUploader from "../utility/PhotoUplaoder";
import uniqid from "uniqid";
import jwt from "jsonwebtoken";

const initialCurrentReading = {
  book_id: { title: "", description: "", image: "" },
};

function setBreadcrumb(breadCrumb) {
  let breadCrumbs = store.getState().breadCrumbs;
  if (breadCrumbs[breadCrumbs.length - 1].path !== breadCrumb.path) {
    store.dispatch({
      type: "ADD_BREADCRUMB",
      breadCrumb,
    });
  }
}

const Group = (props) => {
  const backgroundSettings = useRef(null);
  const currentBookSettings = useRef(null);
  const backgroundPhotoUploader = useRef(null);
  const inviteMaker = useRef(null);
  let groupId = props.match.params.groupId;

  let user = props.user;
  let myVote = user.groupMember.current_vote
    ? user.groupMember.current_vote
    : -1;
  const [group, setGroup] = useState({
    books: [],
    name: "",
    description: "",
    create_user: { photo: "", username: "" },
    interested_genres: [],
    background_photo: "",
  });

  const [inviteEmail, setInviteEmail] = useState("");

  const [currentlyReading, setCurrentlyReading] = useState(
    initialCurrentReading
  );

  const [tick, setTick] = useState(false);
  const [loading, setLoading] = useState(false);

  const [readNextBooks, setReadNextBooks] = useState([]);
  const [readBooks, setReadBooks] = useState([]);

  let invitationToken = props.match.params.invitationToken;
  let invitationId;
  if (invitationToken) {
    try {
      let decoded = jwt.verify(invitationToken, "secret_123456789");
      invitationId = decoded.invitation_id ? decoded.invitation_id : null;
    } catch (err) {
      // err
    }
  }
  const [invitation, setInvitation] = useState({
    invitationId: "",
    invitationToken: "",
    valid: false,
  });

  useEffect(() => {
    if (invitationToken && invitationId) {
      CheckInvitationValidity(invitationToken, invitationId, (res) => {
        if (!res.error) {
          setInvitation((prev) => Object.assign({}, prev, res));
        }
      });
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    GetGroup(groupId, (res) => {
      if (!res.error) {
        let currentReadIndex = res.books.findIndex((x) => x.currently_reading);

        setCurrentlyReading(
          currentReadIndex !== -1
            ? res.books[currentReadIndex]
            : initialCurrentReading
        );

        if (currentReadIndex >= 0) {
          res.books.splice(currentReadIndex, 1);
        }
        setBreadcrumb({
          title: res.name,
          path: `/groups/${groupId}`,
          category: "groups",
        });
        setGroup(res);
        setReadBooks(res.books.filter((x) => x.book_already_read));
        setReadNextBooks(res.books.filter((x) => !x.book_already_read));
        setLoading(false);
      }
    });
  }, [tick]);

  const role =
    user.groupMember.role !== "admin" &&
    user.groupMember.role !== "co-admin" &&
    user.groupMember.role !== "chief" &&
    user.groupMember.role !== "member"
      ? "guest"
      : user.groupMember.role;

  const leaderBook = readNextBooks.length
    ? readNextBooks.sort((a, b) =>
        a.read_next_votes > b.read_next_votes
          ? -1
          : a.read_next_votes < b.read_next_votes
          ? 1
          : 0
      )[0]
    : { book_id: { title: "", image: "", _id: "" } };

  const previousRead = readBooks.length
    ? readBooks.sort((a, b) =>
        a.read_finish_date > b.read_finish_date
          ? -1
          : a.read_finish_date < b.read_finish_date
          ? 1
          : 0
      )[0]
    : { book_id: { title: "", image: "", _id: "" } };

  const SendInvitation = () => {
    inviteMaker.current.click();
    InviteMemberToGroup(inviteEmail, user._id, groupId, (res) => {
      if (!res.error) {
        store.dispatch({
          type: "SET_NOTIFICATION",
          notification: {
            title: "Invitation sent",
            message: "You send invitation to " + inviteEmail,
            type: "success",
          },
        });
      } else {
        store.dispatch({
          type: "SET_NOTIFICATION",
          notification: {
            message: "Failed to send invitation",
            type: "failure",
            title: "Invitation not sent",
          },
        });
      }
    });
  };

  return (
    <div className="row no-gutters pb-5" style={{ opacity: loading ? 0.5 : 1 }}>
      <div className="col-12">
        <div className="row no-gutters justify-content-center bg-white mb-3">
          <div
            className="col-xl-9 col-12 alert-secondary position-relative bg-image"
            style={{
              height: "200px",
              backgroundImage: `url(${
                group.background_photo ? group.background_photo : ""
              })`,
            }}
          >
            {!group.background_photo && (
              <div
                style={{ top: 0, left: 0 }}
                className="row no-gutters w-100 position-absolute h-100 align-items-center justify-content-center"
              >
                <BsImage fontSize="45px"></BsImage>
              </div>
            )}
            {(role === "admin" || role === "co-admin") && (
              <div className="row no-gutters justify-content-between px-2 pt-2">
                <div
                  onClick={() => backgroundPhotoUploader.current.click()}
                  className="col-auto fb-btn-light"
                >
                  <PhotoUploader
                    domRef={backgroundPhotoUploader}
                    onUpload={(photo) => {
                      let gr = { background_photo: photo, _id: group._id };
                      UpdateGroup(gr, (res) => {
                        if (!res.error) {
                          setTick(!tick);
                          store.dispatch({
                            type: "SET_NOTIFICATION",
                            notification: {
                              message: "Group photo uploaded",
                              type: "success",
                              title: "Success",
                            },
                          });
                        } else {
                          store.dispatch({
                            type: "SET_NOTIFICATION",
                            notification: {
                              message: res.error,
                              type: "failure",
                              title: "Something went wrong",
                            },
                          });
                        }
                      });
                    }}
                  ></PhotoUploader>
                  Add cover photo
                </div>
                <Popover
                  content={
                    <div className="p-2">
                      <div
                        className="fb-btn"
                        onClick={() => {
                          backgroundSettings.current.click();
                          let gr = { background_photo: "", _id: group._id };
                          UpdateGroup(gr, (res) => {
                            if (!res.error) {
                              setTick(!tick);
                              store.dispatch({
                                type: "SET_NOTIFICATION",
                                notification: {
                                  message: "Group photo removed",
                                  type: "success",
                                  title: "Success",
                                },
                              });
                            } else {
                              store.dispatch({
                                type: "SET_NOTIFICATION",
                                notification: {
                                  message: res.error,
                                  type: "failure",
                                  title: "Something went wrong",
                                },
                              });
                            }
                          });
                        }}
                      >
                        Remove
                      </div>
                    </div>
                  }
                >
                  <div
                    className="fb-btn-light col-auto"
                    ref={backgroundSettings}
                  >
                    <BsThreeDots fontSize="24px"></BsThreeDots>
                  </div>
                </Popover>
              </div>
            )}
          </div>
          <div className="col-xl-9 col-12 py-3">
            <div className="row no-gutters justify-content-between px-xl-0 px-3">
              <div className="col-auto h4">
                <div className="row no-gutters">
                  <label>Group</label>
                </div>
                <div className="row no-gutters">{group.name}</div>
              </div>
              {role === "guest" && invitation.valid && (
                <div
                  className="col-auto fb-btn-success"
                  onClick={() =>
                    AcceptInvitationToGroup(
                      groupId,
                      user._id,
                      invitationId,
                      (res) => {
                        if (!res.error) {
                          store.dispatch({
                            type: "SET_NOTIFICATION",
                            notification: {
                              title: "Invitation accepted",
                              message: `Now you are member of ${group.name}`,
                              type: "success",
                            },
                          });
                          store.dispatch({
                            type: "UPDATE_USER",
                            user: {
                              groupMember: {
                                role: "member",
                                group_id: groupId,
                              },
                            },
                          });
                        } else {
                          store.dispatch({
                            type: "SET_NOTIFICATION",
                            notification: {
                              title: "Somerthing went wrong",
                              message: `Accepting failed`,
                              type: "failure",
                            },
                          });
                        }
                      }
                    )
                  }
                >
                  <div className="row no-gutters">
                    <div className="col-auto mr-2">
                      <BsCheck fontSize="24px" color="white"></BsCheck>
                    </div>
                    <div className="col-auto">Accept invitation</div>
                  </div>
                </div>
              )}
              {role === "admin" || role === "co-admin" ? (
                <div className="col-auto">
                  <div className="row no-gutters">
                    <div
                      className="col-auto mr-2 fb-btn-pro"
                      onClick={() => history.push("/search")}
                    >
                      Add books
                    </div>
                    <Popover
                      content={
                        <div className="popover-inner p-2">
                          <div className="popover-title">Invite reader</div>
                          <div className="text-left">
                            <label>email</label>
                            <input
                              onKeyUp={(e) => {
                                e.persist();
                                if (e.keyCode === 13) {
                                  SendInvitation();
                                }
                              }}
                              value={inviteEmail}
                              onChange={(e) => {
                                e.persist();
                                setInviteEmail(e.target.value);
                              }}
                              type="text"
                              className="d-block general-input mb-2"
                            ></input>
                          </div>
                          <div className="d-flex flex-nowrap justify-content-center">
                            <div
                              className="col-auto mr-2 btn-pro"
                              onClick={() => SendInvitation()}
                            >
                              Invite
                            </div>
                            <div
                              className="col-auto btn"
                              onClick={() => inviteMaker.current.click()}
                            >
                              Cancel
                            </div>
                          </div>
                        </div>
                      }
                    >
                      <div className="col-auto fb-btn-pro" ref={inviteMaker}>
                        Invite readers
                      </div>
                    </Popover>
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
        <div className="row no-gutters justify-content-center">
          <div className="col-xl-9 col-12">
            <div className="row no-gutters justify-content-center">
              <div className="col-12 col-md-7 pr-3 pl-xl-0 pl-3 py-3">
                <div className="h-100 row no-gutters p-3 static-card bg-white">
                  <div className="col-12 d-flex flex-column">
                    <div
                      className="row no-gutters static-card-title-bigger justify-content-between"
                      style={{ flex: "0 0 auto" }}
                    >
                      <div className="col-auto mr-2">Currently reading</div>
                      {(role === "admin" || role === "co-admin") && (
                        <Popover
                          content={
                            <div className="p-2">
                              <div
                                className="fb-btn"
                                onClick={() => {
                                  currentBookSettings.current.click();
                                  if (currentlyReading.book_id.title) {
                                    CompleteBookReading(
                                      currentlyReading.group_id,
                                      currentlyReading.book_id,
                                      (res) => {
                                        if (!res.error) {
                                          store.dispatch({
                                            type: "SET_NOTIFICATION",
                                            notification: {
                                              type: "success",
                                              title: "Success",
                                              message: "Book marked as read",
                                            },
                                          });
                                          setTick(!tick);
                                        }
                                      }
                                    );
                                  } else {
                                    store.dispatch({
                                      type: "SET_NOTIFICATION",
                                      notification: {
                                        type: "failure",
                                        title: "No current read",
                                        message:
                                          "You don't have currently reading book",
                                      },
                                    });
                                  }
                                }}
                              >
                                Complete
                              </div>
                            </div>
                          }
                        >
                          <div
                            className="col-auto fb-btn"
                            ref={currentBookSettings}
                          >
                            <BsThreeDots fontSize="24px"></BsThreeDots>
                          </div>
                        </Popover>
                      )}
                    </div>
                    <div
                      className="row no-gutters align-items-center"
                      style={{ flex: "1 1 auto" }}
                    >
                      <div className="col-12">
                        {currentlyReading.book_id.title ? (
                          <div
                            className="row no-gutters p-4 cursor-pointer"
                            onClick={() =>
                              history.push(
                                `/books/${currentlyReading.book_id._id}`
                              )
                            }
                          >
                            <div className="col-auto mx-auto mb-3">
                              <img
                                src={currentlyReading.book_id.image}
                                width="150"
                              ></img>
                            </div>
                            <div className="col-lg col-sm col-md-12 col-12 px-4">
                              <div className="row no-gutters h5 mb-2 text-truncate">
                                {currentlyReading.book_id.title}
                              </div>
                              <div className="row no-gutters">
                                <div className="current-read-description">
                                  {currentlyReading.book_id.description}
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="row no-gutters p-5 flex-center">
                            No currently reading book
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-5">
                <div className="row no-gutters">
                  <div className="col-12 pl-3 pr-xl-0 pr-3 py-3">
                    <div className="row no-gutters p-3 static-card bg-white">
                      <div className="col-12 static-card-title">
                        Next reading
                      </div>
                      <div className="col-12">
                        {leaderBook.book_id.title ? (
                          <div
                            className="row no-gutters p-2 cursor-pointer"
                            onClick={() =>
                              history.push(`/books/${leaderBook.book_id._id}`)
                            }
                          >
                            <div className="col-auto mx-auto">
                              <img
                                width="80"
                                src={leaderBook.book_id.image}
                              ></img>
                            </div>
                            <div className="col mx-3">
                              <div className="row no-gutters text-truncate">
                                {leaderBook.book_id.title}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="row no-gutters p-5 flex-center ">
                            No book to read next
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-12 py-3 pl-3 pr-xl-0 pr-3 ">
                    <div className="row no-gutters p-3 bg-white static-card">
                      <div className="col-12 static-card-title">
                        Previous reading
                      </div>
                      <div className="col-12">
                        {previousRead.book_id.title ? (
                          <div
                            className="row no-gutters p-2 cursor-pointer"
                            onClick={() =>
                              history.push(`/books/${previousRead.book_id._id}`)
                            }
                          >
                            <div className="col-auto mx-auto">
                              <img
                                width="80"
                                src={previousRead.book_id.image}
                              ></img>
                            </div>
                            <div className="col mx-3">
                              <div className="row no-gutters text-truncate">
                                {previousRead.book_id.title}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="row no-gutters p-5 flex-center ">
                            No book has been read
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {role !== "guest" && (
          <div className="row no-gutters justify-content-center px-lg-0">
            <div className="col-xl-9 col-12">
              <div className="row no-gutters">
                <div className="col-12 col-lg-6 pl-3 pl-xl-0 pr-3 py-3">
                  <div className="row no-gutters">
                    <div className="col-12 static-card bg-white p-3">
                      <div className="row no-gutters static-card-title">
                        Vote for next reading
                      </div>
                      <div className="row no-gutters">
                        {readNextBooks.length ? (
                          readNextBooks.map((x) => (
                            <div
                              className="col-12 p-3"
                              key={uniqid("read-next-")}
                            >
                              <div className="row no-gutters h-100">
                                <div
                                  className="col-auto mx-auto text-center mb-2 cursor-pointer"
                                  onClick={() =>
                                    history.push(`/books/${x.book_id._id}`)
                                  }
                                >
                                  <img width="120" src={x.book_id.image}></img>
                                </div>
                                <div className="col text-center px-3 text-truncate">
                                  <div className="row no-gutters">
                                    {x.book_id.title}
                                  </div>
                                  <div className="row no-gutters my-2 bg-light px-2 rounded">
                                    {x.read_next_votes} votes
                                  </div>
                                  <div className="row no-gutters mt-5">
                                    <div
                                      className="col-auto fb-btn-pro"
                                      onClick={() => {
                                        VoteForNextBook(
                                          x.book_id._id,
                                          user._id,
                                          groupId,
                                          (res) => {
                                            if (!res.error) {
                                              setTick(!tick);
                                              store.dispatch({
                                                type: "SET_NOTIFICATION",
                                                notification: {
                                                  message: "Vote added",
                                                  title: "Success",
                                                  type: "success",
                                                },
                                              });
                                              store.dispatch({
                                                type: "UPDATE_USER",
                                                user: {
                                                  groupMember: Object.assign(
                                                    {},
                                                    user.groupMember,
                                                    {
                                                      current_vote:
                                                        x.book_id._id,
                                                    }
                                                  ),
                                                },
                                              });
                                            } else {
                                              store.dispatch({
                                                type: "SET_NOTIFICATION",
                                                notification: {
                                                  message: res.error.toString(),
                                                  title:
                                                    "Can't add vote for a book",
                                                  type: "failure",
                                                },
                                              });
                                            }
                                          }
                                        );
                                      }}
                                    >
                                      {myVote === x.book_id._id ? (
                                        <div className="row no-gutters text-success align-items-center">
                                          <BsStarFill
                                            fontSize="24px"
                                            className="mr-2"
                                          ></BsStarFill>
                                          <div>Your vote</div>
                                        </div>
                                      ) : (
                                        <div className="row no-gutters align-items-center">
                                          <BsStar
                                            fontSize="24px"
                                            className="mr-2"
                                          ></BsStar>
                                          <div>Vote</div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="col-12 ">
                            <div className="row no-gutters p-5 flex-center">
                              No books for next reading
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-lg-6 pr-3 pr-xl-0 p-3 py-3">
                  <div className="row no-gutters">
                    <div className="col-12 static-card bg-white p-3">
                      <div className="row no-gutters static-card-title">
                        Reading history
                      </div>
                      <div className="row no-gutters">
                        {readBooks.length ? (
                          readBooks.map((x) => (
                            <div
                              className="col-12 p-3"
                              key={uniqid("already-read-")}
                            >
                              <div
                                className="row no-gutters h-100 cursor-pointer"
                                onClick={() =>
                                  history.push(`/books/${x.book_id._id}`)
                                }
                              >
                                <div className="col-auto mx-auto text-center mb-2">
                                  <img width="120" src={x.book_id.image}></img>
                                </div>
                                <div className="col text-center px-3 text-truncate">
                                  <div className="row no-gutters">
                                    {x.book_id.title}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="col-12">
                            <div className="row no-gutters flex-center p-5">
                              Reading history is empty
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
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

export default connect(mapp)(Group);
