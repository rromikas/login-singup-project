import React from "react";

const HtmlPreview = ({ data }) => {
  return <div dangerouslySetInnerHTML={{ __html: data }}></div>;
};

export default HtmlPreview;
