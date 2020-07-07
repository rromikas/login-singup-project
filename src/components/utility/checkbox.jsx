import React from "react";
import { BsCheck } from "react-icons/bs";
const Checkbox = ({ white = false, checked, setChecked, size, ...rest }) => {
  return (
    <div
      {...rest}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: `${size / 3}px`,
        flexShrink: 0,
      }}
      className={`d-flex justify-content-center align-items-center${
        white ? " checkbox-white " : " checkbox-pro "
      }${rest.className ? rest.className : ""}`}
      onClick={() => {
        setChecked(!checked);
      }}
    >
      {checked && (
        <BsCheck
          strokeWidth="0.5px"
          fontSize={`${size - 10}px`}
          color={white ? "white" : "unset"}
        ></BsCheck>
      )}
    </div>
  );
};

export default Checkbox;
