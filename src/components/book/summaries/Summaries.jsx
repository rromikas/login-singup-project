import React, { useState, useEffect } from "react";
import { uid } from "react-uid";
import history from "../../../routing/history";
import { format } from "timeago.js";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import { GetSortedSummaries, AddSummary } from "../../../api/socket-requests";
import { toast } from "react-toastify";
import StringPreview from "../../utility/StringPreview";
import Ratings from "react-ratings-declarative";

const Summaries = ({ threads, bookId }) => {
  const limit = 15;
  const [sortBy, setSortBy] = useState("TopRated");
  const [changingSort, setChangingSort] = useState(false);
  const [summaries, setSummaries] = useState([]);

  useEffect(() => {
    GetSortedSummaries({ bookId, limit, sortBy }, (res) => {
      console.log("Response get sorted summeris SUmarries.js", res);
      if (res.error) {
        toast.error(res.error.toString());
      } else {
        setSummaries(res.summaries.map((x) => x.summary));
      }
    });
  }, [sortBy]);

  return (
    <div className="row no-gutters text-dark">
      <div className="col-12 h1">Summaries</div>
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
                        onClick={() => setSortBy("Top rated")}
                      >
                        Top rated
                      </div>
                      <div
                        className="pl-3 pr-5 py-3 bg-white cursor-pointer sort-item"
                        onClick={() => setSortBy("Most recent")}
                      >
                        Most recent
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-6">
                <div className="row no-gutters justify-content-end px-3 h-100 align-items-center">
                  <div
                    className="outline-btn-square h-85 px-3 bg-white"
                    onClick={() => {
                      AddSummary(
                        {
                          bookId: bookId,
                          summary: {
                            authorId: "5ed2c382b4080c6b3705ef71",
                            summary: "Test summary",
                            private: false,
                          },
                        },
                        (res) => {
                          console.log("Response after adding summary", res);
                        }
                      );
                    }}
                  >
                    Write summary
                  </div>
                </div>
              </div>
            </div>
          </div>
          {summaries.length > 0 ? (
            summaries.map((x) => (
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
                <div className="row no-gutters">{x.summary}</div>
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

export default Summaries;
