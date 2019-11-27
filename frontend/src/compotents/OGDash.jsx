import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

class ogdash extends Component {
  render() {
    return <section>organizer dashboard</section>;
  }
}

let propList = () => {
  return {};
};

let OGDash = connect(propList)(ogdash);

export default OGDash;
