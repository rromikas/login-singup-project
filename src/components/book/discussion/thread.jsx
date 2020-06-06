import React, { useEffect, useState } from "react";
import {
  GetBook,
  GetThread,
  ReplyToQuestion,
  AddView,
  VoteForReply,
} from "../../../api/socket-requests";
import { toast } from "react-toastify";
import { uid } from "react-uid";
import HtmlPreview from "../../utility/htmlPreview";
import { format } from "timeago.js";
import { renderEditor } from "../../utility/renderEditor";
import StringPreview from "../../utility/StringPreview";
import history from "../../../routing/history";
import { useSelector } from "react-redux";
import { FaRegThumbsDown, FaRegThumbsUp } from "react-icons/fa";
import store from "../../../store/store";

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
        sum > 0 ? " text-success" : sum < 0 ? " text-danger" : " text-secondary"
      }`}
      style={{
        marginRight: "15px"
      }}
    >
      {sum > 0 ? "+" : ""}
      {sum}
    </div>
  );
};

const Thread = (props) => {
  const bookId = props.match.params.bookId;
  const threadId = props.match.params.threadId;
  const user = useSelector((state) => state.user);

  const [book, setBook] = useState({ image: "", title: "", authors: "" });
  const [thread, setThread] = useState({
    createdBy: { photo: "", name: "" },
    description: "",
    title: "",
    replies: [],
    views: 0,
  });
  const [replies, setReplies] = useState([]);
  const [reply, setReply] = useState("");
  const [vote, setVote] = useState("");
  useEffect(() => {
    let filter = { _id: bookId };
    let bc = store.getState().breadCrumbs;

    GetBook(filter, (res) => {
      if (res.error) {
        toast.error(res.error.toString());
      } else {
        setBook(res.filteredBooks[0]);
        if (bc[bc.length - 1].path !== `/books/${bookId}`) {
          store.dispatch({
            type: "ADD_BREADCRUMB",
            breadCrumb: {
              title: res.filteredBooks[0].title,
              path: `/books/${bookId}`,
              category: "books",
            },
          });
        }
      }

      GetThread({ bookId: bookId, threadId: threadId }, (res) => {
        setThread(res.thread);
        setReplies(res.thread.replies);
        if (
          bc[bc.length - 1].path !==
          `/books/${bookId}/threads/${res.thread._id}`
        ) {
          store.dispatch({
            type: "ADD_BREADCRUMB",
            breadCrumb: {
              title: res.thread.title,
              path: `/books/${bookId}/threads/${res.thread._id}`,
              category: "discussions",
            },
          });
        }
      });
    });

    renderEditor("reply-editor", "Reply", reply, (res) => setReply(res));

    AddView({ bookId: bookId, threadId: threadId }, (res) => {});
  }, []);

  return (
    <div className="row no-gutters px-3 px-md-4  px-lg-5 pt-3 pb-5">
      <div className="col-12 p-4 border bg-white">
        <div className="row no-gutters h1 mb-4">Thread</div>
        <div className="row no-gutters justify-content-end justify-content-md-between">
          <div className="col-12 pb-4">
            <div
              className="row no-gutters cursor-pointer"
              onClick={() => history.push(`/books/${book._id}`)}
            >
              <div className="col-12 col-sm-auto pr-3 mb-3 mb-md-0">
                <img src={book.image} width="120" className="img-fluid" />
              </div>
              <div className="col-12 col-sm">
                <div className="row no-gutters h4 book-title">{book.title}</div>
                <div className="row no-gutters">{book.authors}</div>
              </div>
            </div>
          </div>
          <div className="col-12 pr-3 border-top border-bottom py-3">
            <div className="row no-gutters">
              <div className="col-12">
                <div className="row no-gutters">
                  <div className="col-auto d-flex justify-content-end pr-3">
                    <div
                      style={{
                        width: "60px",
                        height: "60px",
                        backgroundImage: `url(${thread.createdBy.photo})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        borderRadius: "50%",
                      }}
                    ></div>
                  </div>
                  <div className="col">
                    <div className="row no-gutters text-primary mb-2">
                      {thread.createdBy.name}
                    </div>
                    <div className="row no-gutters">
                      <div className="mr-3 col-auto">{thread.views} views</div>
                      <div className="mr-3 col-auto">
                        {thread.replies.length} replies
                      </div>
                      <div className="col-auto">{format(thread.date)}</div>
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
                  className="thread-title"
                  string={thread.title}
                  limit="5000"
                ></StringPreview>
              </div>
              <HtmlPreview data={thread.description} limit="5000"></HtmlPreview>
            </div>
          </div>
        </div>
      </div>
      <div className="col-12">
        <div
          className="row lead no-gutters ml-sm-5 ml-0 mt-4 mb-2"
          style={{ fontWeight: "500" }}
        >
          {replies.length} replies
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

                            VoteForReply(
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

                            VoteForReply(
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
          {thread.replies.length === 0 && (
            <div
              className="col-12 p-3 flex-center"
              style={{
                height: "150px",
              }}
            >
              No replies yet. Be the first to reply
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
                  threadId,
                  userId: user._id,
                };
                ReplyToQuestion(obj, (res) => {
                  if (res.error) {
                    toast.error(res.error.toString());
                  } else {
                    history.go();
                  }
                });
              } else {
                history.push("/login", {
                  successPath: `/books/${bookId}/threads/${threadId}`,
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

export default Thread;
