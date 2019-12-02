import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

class ptregistration extends Component {
  register = async e => {
    e.preventDefault();
    console.log("here");

    let data = new FormData();
    data.append("email", "email@test.test");
    data.append("password", "thisisapasswordhi");

    let response = await fetch("/register", {
      method: "POST",
      body: data
    });

    let resBody = await response.text();
    console.log(resBody);

    this.props.dispatch({
      type: "login",
      authStatus: { type: "PT", isLoggedIn: true }
    });
  };

  render() {
    return (
      <section>
        <form onSubmit={this.register}>
          <input
            type="text"
            onChange={this.handleUsername}
            name="username"
            placeholder="username"
          ></input>

          <input
            type="text"
            onChange={this.handleEmail}
            name="email"
            placeholder="email"
          ></input>

          <input
            type="text"
            onChange={this.handlePassword}
            name="password"
            placeholder="password"
          ></input>

          <input
            type="text"
            onChange={this.handleM}
            name="messenger"
            placeholder="messenger"
          ></input>

          <label>role</label>
          <form onChange={this.handleRole} name="role">
            <label for="pt-design">Design</label>
            <input value="design" id="pt-design" type="checkbox"></input>
            <label for="pt-frontend">Frontend</label>
            <input value="frontend" id="pt-frontend" type="checkbox"></input>
            <label for="pt-backend">Backend</label>
            <input value="backend" id="pt-backend" type="checkbox"></input>
          </form>

          <label>Stack</label>
          <form onChange={this.handleStack} name="stack">
            <label for="pt-mean">MEAN</label>
            <input value="mean" id="pt-mean" type="checkbox"></input>
            <label for="pt-mern">MERN</label>
            <input value="mern" id="pt-mern" type="checkbox"></input>
            <label for="pt-python">Python Django</label>
            <input value="python" id="pt-python" type="checkbox"></input>
            <label for="pt-lamp">LAMP</label>
            <input value="lamp" id="pt-lamp" type="checkbox"></input>
            <label for="pt-net">.NET</label>
            <input value="net" id="pt-net" type="checkbox"></input>
            <label for="pt-ruby">Ruby on Rails</label>
            <input value="ruby" id="pt-ruby" type="checkbox"></input>
          </form>

          <input
            type="number"
            max={parseInt(this.props.maxTeamSize)}
            onChange={this.handleSize}
            name="size"
            placeholder="size"
          ></input>

          <label>Looking for teammates for these roles</label>
          <form onChange={this.handleRoleAssoc} name="roleAssoc">
            <label for="roleAssoc-design">Design</label>
            <input value="design" id="roleAssoc-design" type="checkbox"></input>
            <label for="roleAssoc-frontend">Frontend</label>
            <input
              value="frontend"
              id="roleAssoc-frontend"
              type="checkbox"
            ></input>
            <label for="roleAssoc-backend">Backend</label>
            <input
              value="backend"
              id="roleAssoc-backend"
              type="checkbox"
            ></input>
          </form>

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
