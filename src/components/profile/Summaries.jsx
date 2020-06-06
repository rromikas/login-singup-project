import React from "react";
import StringPreview from "../utility/StringPreview";
import history from "../../routing/history";
import Rating from "../utility/Rating";
import { FaPen } from "react-icons/fa";
import { uid } from "react-uid";

const Summaries = ({ summaries }) => {
  return (
    <div className="row no-gutters">
      <div className="col-12 h1 mb-3">Summaries</div>
      {summaries.length ? (
        summaries.map((x) => {
          return (
            <div
              key={uid(x)}
              className="col-12 p-4 border bg-white mb-4 convex rounded-8"
            >
              <div className="row no-gutters">
                <div className="col-auto pr-md-4 mb-3 mb-md-0 mx-auto">
                  <img
                    src={x.bookId.image}
                    width="150"
                    className="img-fluid"
                    onClick={() => history.push(`/books/${x.bookId._id}`)}
                  />
                </div>
                <div className="col-md col-12">
                  <div className="row no-gutters mb-2">
                    {x.private ? "Private" : "Public"}
                  </div>
                  <div className="row no-gutters mb-2">
                    <StringPreview
                      className="thread-title cursor-pointer"
                      style={{ fontWeight: "500" }}
                      string={x.title}
                      limit={1000}
                      onClick={() =>
                        history.push(
                          `/books/${x.bookId._id}/summaries/${x._id}`
                        )
                      }
                    ></StringPreview>
                  </div>
                  <div className="row no-gutters">
                    <Rating rating={x.rating}></Rating>
                  </div>
                  <div className="row no-gutters">
                    <div
                      className="btn-link"
                      onClick={() =>
                        history.push(
                          `/books/${x.bookId._id}/summaries/${x._id}/edit`
                        )
                      }
                    >
                      <FaPen></FaPen>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div
          className="col-12 flex-center bg-white border"
          style={{ height: "150px" }}
        >
          No summaries so far
        </div>
      )}
    </div>
  );
};

export default Summaries;
