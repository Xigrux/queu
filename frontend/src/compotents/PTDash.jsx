import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

class ptdash extends Component {
  render() {
    return <section>participant dashboard</section>;
  }
}

let propList = () => {
  return {};
};

let PTDash = connect(propList)(ptdash);

export default PTDash;
