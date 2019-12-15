import React from "react";
import { FiImage } from "react-icons/fi";
import "../../styles/caq.css";

export default props => (
  <>
    <label htmlFor="single" class="caq-image-picker">
      <FiImage />
    </label>
    <input
      type="file"
      name="image"
      id="single"
      onChange={props.onChange}
      hidden
    />
  </>
);
