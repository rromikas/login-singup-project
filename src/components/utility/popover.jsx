import React, { useState } from "react";
import "react-tippy/dist/tippy.css";
import { Tooltip } from "react-tippy";
import { FaQuestionCircle, FaQuestion } from "react-icons/fa";

const Popover = ({ info }) => {
  const [open, setOpen] = useState(false);
  return (
    <Tooltip
      title={info}
      position="bottom"
      trigger="click"
      theme="light"
      arrow={true}
      open={open}
    >
      {/* <FaQuestion color="#343a40"></FaQuestion> */}

      <div
        onMouseOver={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        style={{
          width: "30px",
          height: "30px",
          borderRadius: "50%",
          border: "1px solid",
        }}
        className="flex-center bg-white"
      >
        ?
      </div>
    </Tooltip>
  );
};

export default Popover;
