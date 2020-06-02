import React from "react";
import { FaCheck } from "react-icons/fa";
const CheckBox = ({ checked, setChecked, size }) => {
  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        flexShrink: 0,
      }}
      className="d-flex justify-content-center align-items-center border border-secondary bg-white"
      onClick={() => {
        setChecked(!checked);
      }}
    >
      {checked && <FaCheck fontSize={`${size - 10}px`}></FaCheck>}
    </div>
  );
};

export default CheckBox;
