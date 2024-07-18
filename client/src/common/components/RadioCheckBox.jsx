import React from "react";
import "./RadioCheckBox.css";

function RadioCheckBox({ isChecked }) {
  return (
    <div className="radioContainer">
      <label className="customRadio">
        <input
          type="radio"
          name="radio-group"
          className="radioInput"
          checked={isChecked}
          readOnly
        />
        <span className="radioCheckmark"></span>
      </label>
    </div>
  );
}

export default RadioCheckBox;
