import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

class landing extends Component {
  login = async e => {
    e.preventDefault();
    console.log("here");

    let data = new FormData();
    data.append("email", "email@test.test");
    data.append("password", "thisisapasswordhi");

    let response = await fetch("/register", {
      method: "POST",
      body: data
    });

    this.props.dispatch({
      type: "login",
      authStatus: { type: "PT", isLoggedIn: true }
    });
  };
  render() {
    return (
      <section>
        Sign up as a participant here PLEASSSSEEE WORK
        <form onSubmit={this.login}>
          <button type="submit">signup</button>
        </form>
      </section>
    );
  }
}

let propList = () => {
  return {};
};

let Landing = connect(propList)(landing);

export default Landing;
