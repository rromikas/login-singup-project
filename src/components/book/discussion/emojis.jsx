import React from "react";
import { emojify } from "react-emojione";

const Emojis = ({ icon }) => {
  return (
    <div id="emoji-wrapper" style={{}}>
      {emojify(
        `<span>${icon}</span><span>${icon}</span><span>${icon}</span><span>${icon}</span><span>${icon}</span>`
      )}
    </div>
  );
};

export default Emojis;
