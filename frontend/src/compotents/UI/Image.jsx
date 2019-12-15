import React from "react";
import { FiXCircle } from "react-icons/fi";

export default props => (
  <div className="fadein">
    <div
      onClick={() => props.removeImage(props.image.public_id)}
      className="delete"
    >
      <FiXCircle />
    </div>
    <img src={props.image.secure_url} class="caq-img-preview" alt="" />
  </div>
);
