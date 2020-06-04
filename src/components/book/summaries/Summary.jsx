import React, { useEffect, useState } from "react";
import * as Api from "../../../api/socket-requests";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { uid } from "react-uid";
import HtmlPreview from "../../utility/htmlPreview";
import StringPreview from "../../utility/StringPreview";
import { format } from "timeago.js";
import { FaRegThumbsDown, FaRegThumbsUp } from "react-icons/fa";
import history from "../../../routing/history";
import store from "../../../store/store";
import Rating from "../../utility/Rating";
import { renderEditor } from "../../utility/renderEditor";

const clickAnimation = (setVote, vote, replyIndex) => {
  setVote([replyIndex, vote]);
  setTimeout(() => {
    setVote(0);
  }, 500);
};

const formatVotes = (votes) => {
  let sum = votes.reduce((a, b) => {
    return a + b.value;
  }, 0);
  return (
    <div
      className={`d-flex align-items-center${
        sum > 0 ? " text-primary" : sum < 0 ? " text-danger" : " text-secondary"
      }`}
      style={{
        marginRight: "15px",
        width: "20px",
      }}
    >
      {sum > 0 ? "+ " : ""}
      {sum}
    </div>
  );
};

const Summary = (props) => {
  const summaryId = props.match.params.summaryId;
  const bookId = props.match.params.bookId;
  const user = props.user;
  const [summary, setSummary] = useState({
    summary: "",
    title: "",
    author: { name: "", photo: "" },
    rating: 0,
    ratings: [],
    bookId: { _id: 0 },
    comments: [],
  });

  const [reply, setReply] = useState("");
  const [vote, setVote] = useState("");
  const [replies, setReplies] = useState([]);

  useEffect(() => {
    Api.GetSummary(
      { summaryId, userToken: localStorage["secret_token"] },
      (res) => {
        if (res.summary) {
          setSummary(res.summary);
          setReplies(res.summary.comments);

          let bc = store.getState().breadCrumbs;
          if (
            bc[bc.length - 1].path !==
            `/books/${bookId}/summaries/${res.summary._id}`
          ) {
            if (bc[bc.length - 1].path !== `/books/${bookId}`) {
              store.dispatch({
                type: "ADD_BREADCRUMB",
                breadCrumb: {
                  title: res.summary.bookId.title,
                  path: `/books/${bookId}`,
                  category: "books",
                },
              });
            }

            store.dispatch({
              type: "ADD_BREADCRUMB",
              breadCrumb: {
                title: `By ${res.summary.author.name}`,
                path: `/books/${bookId}/summaries/${res.summary._id}`,
                category: "summaries",
              },
            });
          }
        }
      }
    );
    renderEditor("reply-editor", "Comment", reply, (res) => setReply(res));
  }, []);

  return (
    <div className="row no-gutters px-3 px-md-4 px-lg-5 pt-3 pb-5 text-dark">
      <div className="col-12 p-4 border bg-white">
        <div className="row no-gutters h1 mb-4">Summary</div>
        <div className="row no-gutters justify-content-end justify-content-md-between text-dark">
          <div className="col-12 pb-4">
            <div
              className="row no-gutters cursor-pointer"
              onClick={() => history.push(`/books/${summary.bookId._id}`)}
            >
              <div className="col-12 col-sm-auto pr-3 mb-3 mb-md-0">
                <img
                  src={summary.bookId.image}
                  width="120"
                  className="img-fluid"
                />
              </div>
              <div className="col-12 col-sm">
                <div className="row no-gutters h4 book-title">
                  {summary.bookId.title}
                </div>
                <div className="row no-gutters">{summary.bookId.authors}</div>
              </div>
            </div>
          </div>
          <div className="col-12 pr-3 py-3 border-top border-bottom">
            <div className="row no-gutters">
              <div className="col-12">
                <div className="row no-gutters align-items-bottom text-secondary">
                  <div className="col-auto pr-3">
                    <div className="row no-gutters justify-content-end">
                      <div className="col-12">
                        <div
                          style={{
                            width: "60px",
                            height: "60px",
                            backgroundImage: `url(${summary.author.photo})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            borderRadius: "50%",
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className="col">
                    <div className="row no-gutters text-primary mb-3">
                      {summary.author.name}
                    </div>
                    <div className="row no-gutters pb-2">
                      <div className="mr-3 col-auto">{summary.views} views</div>
                      <div className="mr-3 col-auto">
                        {replies.length} comments
                      </div>
                      <div className="mr-3 col-auto">
                        {format(summary.date)}
                      </div>
                    </div>
                    <div className="row no-gutters">
                      <Rating rating={summary.rating}></Rating>
                      <div className="ml-2 text-muted">({summary.rating})</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row no-gutters py-3">
          <div className="col">
            <div className="row no-gutters mb-2">
              <div className="col-12 h4 mb-4">
                <StringPreview
                  string={summary.title}
                  limit="5000"
                  className="thread-title"
                ></StringPreview>
              </div>
              <HtmlPreview data={summary.summary} limit="5000"></HtmlPreview>
            </div>
          </div>
        </div>
      </div>
      <div className="col-12">
        <div className="row no-gutters lead p-4 bg-white border my-3">
          <div className="col-12 text-center">How is the summary?</div>
          <div className="col-12 text-center mt-2">
            <Rating
              rating={
                summary.ratings.find((x) => x.ratedBy === user._id)?.rating
              }
              size="40px"
              onSet={(newRating) => {
                if (user._id) {
                  Api.RateSummary(
                    {
                      rating: newRating,
                      userId: user._id,
                      summaryId: summary._id,
                    },
                    (res) => {}
                  );
                } else {
                  history.push("/login", {
                    successPath: `/books/${bookId}/summaries/${summary._id}`,
                  });
                }
              }}
            ></Rating>
          </div>
        </div>
      </div>
      <div className="col-12">
        <div
          className="row lead no-gutters ml-sm-5 ml-0 mt-4 mb-2"
          style={{ fontWeight: "500" }}
        >
          {replies.length} comments
        </div>
        <div
          className="row no-gutters ml-sm-5 ml-0 mb-4 border"
          style={{ background: "white", borderRadius: "8px" }}
        >
          {replies.map((x, i) => (
            <div
              className={`col-12${
                i < replies.length - 1 ? " border-bottom" : ""
              } p-3`}
              key={uid(x)}
            >
              <div className="row no-gutters p-3">
                <div className="col-auto d-flex justify-content-end">
                  <div
                    style={{
                      width: "60px",
                      height: "60px",
                      backgroundImage: `url(${x.repliedBy.photo})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      borderRadius: "50%",
                    }}
                  ></div>
                </div>
                <div className="col pl-3">
                  <div className="row no-gutters">
                    <div className="mr-3 text-primary">{x.repliedBy.name}</div>
                    <div>{format(x.date)}</div>
                  </div>
                  <div className="row no-gutters mb-2">
                    <HtmlPreview data={x.reply}></HtmlPreview>
                  </div>
                  <div className="row no-gutters">
                    {formatVotes(x.votes)}
                    <div
                      className={`icon-btn flex-center mr-2${
                        vote[0] === i && vote[1] === 1
                          ? " click-effect-like"
                          : ""
                      }`}
                      style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "50%",
                      }}
                    >
                      <FaRegThumbsUp
                        color={
                          user._id
                            ? x.votes.filter(
                                (x) => x.by._id === user._id && x.value === 1
                              ).length > 0
                              ? "#007bff"
                              : "#6c757d"
                            : "#6c757d"
                        }
                        onClick={(e) => {
                          e.persist();
                          if (user._id) {
                            clickAnimation(setVote, 1, i);
                            let index = replies[i].votes.findIndex(
                              (x) => x.by._id === user._id
                            );
                            let newVote = 1;
                            if (index >= 0) {
                              newVote =
                                replies[i].votes[index].value === 1 ? 0 : 1;
                              setReplies((rep) => {
                                let arr = [...rep];
                                arr[i].votes[index].value = newVote;
                                return arr;
                              });
                            } else {
                              setReplies((rep) => {
                                let newArr = [
                                  ...rep[i].votes,
                                  { by: { _id: user._id }, value: newVote },
                                ];
                                let arr = rep.map((x, ind) =>
                                  i === ind
                                    ? Object.assign({}, x, {
                                        votes: newArr,
                                      })
                                    : x
                                );
                                return arr;
                              });
                            }

                            Api.VoteForReply(
                              {
                                userId: user._id,
                                replyId: x._id,
                                vote: newVote,
                              },
                              (res) => {}
                            );
                          }
                        }}
                        style={{ fontSize: "20px" }}
                      ></FaRegThumbsUp>
                    </div>
                    <div
                      className={`icon-btn flex-center${
                        vote[0] === i && vote[1] === -1
                          ? " click-effect-dislike"
                          : ""
                      }`}
                      style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "50%",
                      }}
                    >
                      <FaRegThumbsDown
                        color={
                          user._id
                            ? x.votes.filter(
                                (x) => x.by._id === user._id && x.value === -1
                              ).length > 0
                              ? "#f88888"
                              : "#6c757d"
                            : "#6c757d"
                        }
                        onClick={(e) => {
                          e.persist();
                          if (user._id) {
                            clickAnimation(setVote, -1, i);
                            let index = replies[i].votes.findIndex(
                              (x) => x.by._id === user._id
                            );
                            let newVote = -1;
                            if (index >= 0) {
                              newVote =
                                replies[i].votes[index].value === -1 ? 0 : -1;
                              setReplies((rep) => {
                                let arr = [...rep];
                                arr[i].votes[index].value = newVote;
                                return arr;
                              });
                            } else {
                              setReplies((rep) => {
                                let newArr = [
                                  ...rep[i].votes,
                                  { by: { _id: user._id }, value: newVote },
                                ];
                                let arr = rep.map((x, ind) =>
                                  i === ind
                                    ? Object.assign({}, x, {
                                        votes: newArr,
                                      })
                                    : x
                                );
                                return arr;
                              });
                            }

                            Api.VoteForReply(
                              {
                                userId: user._id,
                                replyId: x._id,
                                vote: newVote,
                              },
                              (res) => {}
                            );
                          }
                        }}
                        style={{ fontSize: "20px" }}
                      ></FaRegThumbsDown>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {replies.length === 0 && (
            <div
              className="col-12 p-3 flex-center"
              style={{
                height: "150px",
              }}
            >
              No comments yet. Be the first to comment
            </div>
          )}
        </div>
        <div className="row no-gutters ml-sm-5 ml-0" id="reply-editor"></div>
        <div className="row no-gutters ml-sm-5 ml-0">
          <div
            className="btn btn-primary py-3 px-5 mt-3"
            onClick={() => {
              if (user._id) {
                let obj = {
                  reply,
                  bookId,
                  summaryId,
                  userId: user._id,
                };
                Api.CommentSummary(obj, (res) => {
                  if (res.error) {
                    toast.error(res.error.toString());
                  } else {
                    history.go();
                  }
                });
              } else {
                history.push("/login", {
                  successPath: `/books/${bookId}/summaries/${summaryId}`,
                });
              }
            }}
          >
            Publish
          </div>
        </div>
      </div>
    </div>
  );
};

function mapStateToProps(state, ownProps) {
  return {
    user: state.user,
    ...ownProps,
  };
}

export default connect(mapStateToProps)(Summary);
