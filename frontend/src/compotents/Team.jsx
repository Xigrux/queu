import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

class team extends Component {
  render() {
    return <section>New Component</section>;
  }
}

let propList = () => {
  return {};
};

let Team = connect(propList)(team);

export default Team;
