import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

class ptregistration extends Component {
  render() {
    return (
      <section>
        <form onSubmit={this.login}>
          <input type="text" name="event" placeholder="event"></input>
          <input type="text" name="username" placeholder="username"></input>
          <input type="text" name="email" placeholder="email"></input>
          <input type="text" name="password" placeholder="password"></input>
          <input type="text" name="messenger" placeholder="messenger"></input>
          <input type="text" name="role" placeholder="role"></input>
          <input type="text" name="stack" placeholder="stack"></input>
          <input type="text" name="size" placeholder="size"></input>
          <input type="text" name="roleAssoc" placeholder="roleAssoc"></input>
          <button type="submit">signup</button>
        </form>
      </section>
    );
  }
}

let propList = () => {
  return {};
};

let PTRegistration = connect(propList)(ptregistration);

export default PTRegistration;
