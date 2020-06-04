import React, { useState, useEffect } from "react";
import { uid } from "react-uid";
import history from "../../../routing/history";
import { format } from "timeago.js";
import { FaCaretDown } from "react-icons/fa";
import { GetSortedSummaries } from "../../../api/socket-requests";
import { toast } from "react-toastify";
import Ratings from "react-ratings-declarative";
import StringPreview from "../../utility/StringPreview";

const Summaries = ({ bookId }) => {
  const limit = 15;
  const [sortBy, setSortBy] = useState("Top Rated");
  const [changingSort, setChangingSort] = useState(false);
  const [localSummaries, setSummaries] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    GetSortedSummaries(
      { bookId, limit, sortBy: sortBy.replace(" ", "") },
      (res) => {
        if (res.error) {
          toast.error(res.error.toString());
        } else {
          setSummaries(res.summaries.map((x) => x));
        }
        setLoading(false);
      }
    );
  }, [sortBy]);

  return (
    <div className="row no-gutters text-dark">
      <div className="col-12">
        <div className="row no-gutters" style={{ opacity: loading ? 0.5 : 1 }}>
          <div
            className="col-12 border-top border-right border-left"
            style={{ background: "white" }}
          >
            <div className="row no-gutters py-2">
              <div className="col-7" style={{ position: "relative" }}>
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
                        onClick={() => setSortBy("Top Rated")}
                      >
                        Top rated
                      </div>
                      <div
                        className="pl-3 pr-5 py-3 bg-white cursor-pointer sort-item"
                        onClick={() => setSortBy("Most Recent")}
                      >
                        Most recent
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-5">
                <div className="row no-gutters justify-content-end px-3 h-100 align-items-center">
                  <div
                    className="outline-btn-square h-85 px-3 bg-white text-center py-3"
                    onClick={() => {
                      history.push(`/books/${bookId}/summaries/new`);
                    }}
                  >
                    Write summary
                  </div>
                </div>
              </div>
            </div>
          </div>
          {localSummaries.length > 0 ? (
            localSummaries.map((x) => (
              <div
                className="col-12 border p-3"
                style={{ background: "white" }}
                key={uid(x)}
              >
                <div className="row no-gutters mb-3">
                  <div className="d-flex mr-4">
                    <div className="mr-1">Author</div>
                    <div className="theme-font">{x.author.name}</div>
                  </div>
                  <div>{format(x.date)}</div>
                </div>
                <div className="row no-gutters">
                  <StringPreview
                    style={{ fontWeight: 500, cursor: "pointer" }}
                    onClick={() =>
                      history.push(`/books/${bookId}/summaries/${x._id}`)
                    }
                    string={x.title}
                    limit="1000"
                    expandOption={false}
                    className="mb-2"
                  ></StringPreview>
                </div>
                <div className="row no-gutters mb-1">
                  <Ratings
                    rating={x.rating}
                    widgetRatedColors="orange"
                    widgetDimensions="25px"
                    widgetSpacings="0px"
                  >
                    <Ratings.Widget />
                    <Ratings.Widget />
                    <Ratings.Widget />
                    <Ratings.Widget />
                    <Ratings.Widget />
                  </Ratings>
                </div>
              </div>
            ))
          ) : (
            <div
              className="col-12 p-3 flex-center border"
              style={{ height: "150px", background: "white" }}
            >
              No summaries yet. Write the first one.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Summaries;
