import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

class footer extends Component {
  render() {
    return <footer class="blur">footer</footer>;
  }
}

let propList = () => {
  return {};
};

let Footer = connect(propList)(footer);

export default Footer;
