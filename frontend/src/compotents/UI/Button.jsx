import React from "react";
import { FiImage } from "react-icons/fi";

export default props => (
  <div className="buttons fadein">
    <div className="button">
      <label htmlFor="single">
        <FiImage />
      </label>
      <input
        type="file"
        name="image"
        id="single"
        onChange={props.onChange}
        hidden
      />
    </div>
  </div>
);
