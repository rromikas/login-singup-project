import React, { useState } from "react";
var truncate = require("html-truncate");

const HtmlPreview = ({ data, limit, expandOption = true }) => {
  const truncated = truncate(data, limit);
  const [showAll, setShowAll] = useState(false);
  return (
    <div>
      <div
        dangerouslySetInnerHTML={{ __html: showAll ? data : truncated }}
      ></div>
      {truncated.length < data.length && expandOption ? (
        <div
          className="btn btn-outline-secondary"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? "Hide" : "See all"}
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default HtmlPreview;
