import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

class signin extends Component {
  render() {
    return <section>Sign IN FORM</section>;
  }
}

let propList = () => {
  return {};
};

let SignIn = connect(propList)(signin);

export default SignIn;
