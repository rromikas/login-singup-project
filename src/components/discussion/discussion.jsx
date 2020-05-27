import React, { useState, useEffect } from "react";
import { uid } from "react-uid";
import history from "../../routing/history";
import { format } from "timeago.js";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import { getSortedThreads } from "../../javascript/requests";
import { toast } from "react-toastify";

const Discussion = ({ threads, bookId }) => {
  const limit = 15;
  const [sortBy, setSortBy] = useState("Latest");
  const [changingSort, setChangingSort] = useState(false);
  const [discussionThreads, setDiscussionThreads] = useState([]);

  useEffect(() => {
    getSortedThreads({ bookId, limit, sortBy }, (res) => {
      console.log(res);
      if (res.data.error) {
        toast.error(res.data.error.toString());
      } else {
        setDiscussionThreads(res.data.threads);
      }
    });
  }, [sortBy]);

  useEffect(() => {
    if (threads.length === 0) {
      setDiscussionThreads(threads);
    }
  }, [threads]);

  return (
    <div className="row no-gutters text-dark">
      <div className="col-12 h1">Discussion</div>
      <div className="col-12">
        <div className="row no-gutters my-3">
          <div className="col-12 border" style={{ background: "white" }}>
            <div className="row no-gutters">
              <div className="col-6 py-3" style={{ position: "relative" }}>
                <div
                  className="px-3 d-flex disable-select align-items-center h-100"
                  onClick={() => setChangingSort(!changingSort)}
                >
                  <div className="mr-2">Sort by:</div>
                  <div>
                    {sortBy}
                    <FaCaretDown fontSize="14px"></FaCaretDown>
                    <div
                      className="shift disable-select"
                      style={{
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        zIndex: 5,
                        display: changingSort ? "block" : "none",
                      }}
                    >
                      <div
                        className="pl-3 pr-5 py-3 bg-white cursor-pointer sort-item"
                        onClick={() => setSortBy("Latest")}
                      >
                        Latest
                      </div>
                      <div
                        className="pl-3 pr-5 py-3 bg-white cursor-pointer sort-item"
                        onClick={() => setSortBy("Unanswered")}
                      >
                        Unanswered
                      </div>
                      <div
                        className="pl-3 pr-5 py-3 bg-white cursor-pointer sort-item"
                        onClick={() => setSortBy("Top")}
                      >
                        Top
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-6">
                <div className="row no-gutters justify-content-end px-3 h-100 align-items-center">
                  <div
                    className="outline-btn-square h-85 px-3 bg-white"
                    onClick={() => history.push(`/books/${bookId}/threads/new`)}
                  >
                    New thread
                  </div>
                </div>
              </div>
            </div>
          </div>
          {discussionThreads.length > 0 ? (
            discussionThreads.map((x) => (
              <div
                className="col-12 border p-3"
                style={{ background: "white" }}
                key={uid(x)}
                onClick={() =>
                  history.push(`/books/${bookId}/threads/${x._id}`)
                }
              >
                <div className="row no-gutters">
                  <div className="col-8 pl-3">
                    <div
                      className="row no-gutters mt-1 mb-4"
                      style={{ fontWeight: "500" }}
                    >
                      {x.title}
                    </div>
                    <div className="row no-gutters">
                      <div className="d-flex mr-4">
                        <div className="mr-1">Created by</div>
                        <div className="theme-font">{x.createdBy.name}</div>
                      </div>
                      <div>{format(x.date)}</div>
                    </div>
                  </div>
                  <div className="col-4 d-flex align-items-center justify-content-center">
                    <div className="row no-gutters align-items-center justify-content-center">
                      <div className="mr-4 text-center">{x.views} views</div>
                      <div className="mr-4 text-center">
                        {x.replies.length} replies
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div
              className="col-12 p-3 flex-center border"
              style={{ height: "150px", background: "white" }}
            >
              No threads yet. Open the first thread.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Discussion;
