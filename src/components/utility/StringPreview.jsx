import React, { useState } from "react";

const StringPreview = ({ string, limit, expandOption = true, ...rest }) => {
  const [showAll, setShowAll] = useState(false);
  let trimed = string.substring(0, limit);
  return (
    <div>
      <div className="mr-1 mb-1" {...rest}>
        {showAll ? string : trimed}
      </div>
      {trimed.length < string.length && expandOption && (
        <div
          className="btn btn-outline-secondary"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? "Hide" : "See all"}
        </div>
      )}
    </div>
  );
};

export default StringPreview;
