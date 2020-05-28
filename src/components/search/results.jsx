import React from "react";
import { uid } from "react-uid";
import history from "../../routing/history";

const Results = ({ results }) => {
  let pairedResults = [];
  results.items.forEach((element, i) => {
    if (i % 2 === 0) {
      pairedResults.push([element]);
    } else {
      pairedResults[pairedResults.length - 1].push(element);
    }
  });

  const color = "white";
  return (
    <div className="row no-gutters text-dark">
      <div className="col-12 h1 my-3 px-2">{results.title}</div>
      {pairedResults.map((x) => (
        <div className="h-100 w-100 row no-gutters" key={uid(x)}>
          <div
            className="col-lg-6 col-12 p-2 cursor-pointer"
            key={uid(x[0])}
            onClick={() => history.push(`/books/${x[0]._id}`)}
          >
            <div
              className="row h-100 no-gutters border overflow-hidden p-4 text-dark rounded-8"
              style={{
                background:
                  color === "red"
                    ? "radial-gradient(circle at left bottom,#f7b9b9,#f88888)"
                    : "white",
                minHeight: "240px",
              }}
            >
              <div className="col-auto mx-auto mb-2">
                <img src={x[0].image} alt={x[0].image}></img>
              </div>
              <div
                className="col-sm-12 col-md col pl-3"
                style={{ minWidth: "190px" }}
              >
                <div className="row no-gutters lead mb-2">
                  {x[0].title.length > 60
                    ? x[0].title.substring(0, 60) + "..."
                    : x[0].title}
                </div>
                <div className="row no-gutters">
                  {x[0].authors.length > 40
                    ? x[0].authors.substring(0, 40) + "..."
                    : x[0].authors}
                </div>
              </div>
            </div>
          </div>
          {x[1] && (
            <div
              className="col-lg-6 col-12 p-2 cursor-pointer"
              key={uid(x[1])}
              onClick={() => history.push(`/books/${x[1]._id}`)}
            >
              <div
                className="row h-100 no-gutters border overflow-hidden p-4 text-dark rounded-8"
                style={{
                  background:
                    color === "red"
                      ? "radial-gradient(circle at left bottom,#f7b9b9,#f88888)"
                      : "white",
                  minHeight: "240px",
                }}
              >
                <div className="col-auto mx-auto mb-2">
                  <img src={x[1].image}></img>
                </div>
                <div
                  className="col-sm-12 col-md col pl-3"
                  style={{ minWidth: "190px" }}
                >
                  <div className="row no-gutters lead mb-2">
                    {x[1].title.length > 60
                      ? x[1].title.substring(0, 60) + "..."
                      : x[1].title}
                  </div>
                  <div className="row no-gutters">
                    {x[1].authors.length > 40
                      ? x[1].authors.substring(0, 40) + "..."
                      : x[1].authors}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
      {pairedResults.length === 0 && results.title !== "" && (
        <div
          className="row no-gutters flex-center w-100 border bg-white"
          style={{ height: "150px" }}
        >
          No books match the query
        </div>
      )}
    </div>
  );
};

export default Results;
