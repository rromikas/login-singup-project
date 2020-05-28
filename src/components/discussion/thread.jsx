import React, { useEffect, useState } from "react";
import {
  GetBook,
  GetThread,
  ReplyToQuestion,
  AddView,
} from "../../api/socket-requests";
import { toast } from "react-toastify";
import { uid } from "react-uid";
import HtmlPreview from "../utility/htmlPreview";
import { format } from "timeago.js";
import { renderEditor } from "./renderEditor";
import StringPreview from "../utility/StringPreview";
import history from "../../routing/history";
import { useSelector } from "react-redux";

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

  const [reply, setReply] = useState("");

  useEffect(() => {
    let filter = { _id: bookId };
    GetBook(filter, (res) => {
      if (res.error) {
        toast.error(res.error.toString());
      } else {
        setBook(res.filteredBooks[0]);
      }
    });

    GetThread({ bookId: bookId, threadId: threadId }, (res) => {
      setThread(res.thread);
    });
    renderEditor("reply-editor", "Reply", reply, (res) => setReply(res));

    AddView({ bookId: bookId, threadId: threadId }, (res) => {});
  }, []);

  return (
    <div
      className="w-100 overflow-auto bg-theme p-lg-4 p-0"
      style={{ minHeight: "100%" }}
    >
      <div
        className="container-fluid p-3 p-sm-4 p-md-5 bg-light corners-theme shift"
        style={{
          maxWidth: "1100px",
          overflow: "hidden",
        }}
      >
        <div className="row no-gutters">
          <div className="col-12 p-4 border bg-white">
            <div className="row no-gutters border-bottom justify-content-end justify-content-md-between">
              <div className="col-12 pb-4">
                <div className="row no-gutters" style={{ maxWidth: "350px" }}>
                  <div className="col-auto pr-3 mb-3 mb-md-0">
                    <img src={book.image} width="100" className="img-fluid" />
                  </div>
                  <div className="col">
                    <div className="row no-gutters h4">{book.title}</div>
                    <div className="row no-gutters">{book.authors}</div>
                  </div>
                </div>
              </div>
              <div className="col-12 pr-3 mb-3">
                <div className="row no-gutters">
                  <div className="col-12 h3 mb-4">
                    <StringPreview
                      string={thread.title}
                      limit="5000"
                    ></StringPreview>
                  </div>
                  <div className="col-12">
                    <div className="row no-gutters">
                      <div className="mr-3">{thread.views} views</div>
                      <div className="mr-3">
                        {thread.replies.length} replies
                      </div>
                      <div>{format(thread.date)}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row no-gutters py-3 px-2">
              <div className="col-auto d-flex justify-content-end">
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
              <div className="col pl-3">
                <div className="row no-gutters text-primary">
                  {thread.createdBy.name}
                </div>
                <div className="row no-gutters mb-2">
                  <HtmlPreview
                    data={thread.description}
                    limit="5000"
                  ></HtmlPreview>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row lead px-3 mt-4 mb-2" style={{ fontWeight: "500" }}>
          {thread.replies.length} replies
        </div>
        <div
          className="row no-gutters mb-4 border"
          style={{ background: "white", borderRadius: "8px" }}
        >
          {thread.replies.map((x, i) => (
            <div
              className={`col-12${
                i < thread.replies.length - 1 ? " border-bottom" : ""
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
        <div className="row no-gutters" id="reply-editor"></div>
        <div className="row no-gutters">
          <div
            className="my-btn bg-theme-simple py-3 px-5 mt-3"
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
