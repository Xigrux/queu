import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

class usercard extends Component {
  render() {
    return <section>New Component</section>;
  }
}

let propList = () => {
  return {};
};

let UserCard = connect(propList)(usercard);

export default UserCard;
