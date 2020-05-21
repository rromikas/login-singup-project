import React from "react";
import { FaCheck } from "react-icons/fa";
const CheckBox = ({ checked, setChecked, size }) => {
  return (
    <div
      tabIndex={0}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: `${size / 3}px`,
        flexShrink: 0,
      }}
      className="d-flex justify-content-center align-items-center concave"
      onClick={() => {
        setChecked(!checked);
      }}
    >
      {checked && <FaCheck fontSize={`${size - 5}px`}></FaCheck>}
    </div>
  );
};

export default CheckBox;
