import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

class ptregistration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: undefined,
      email: undefined,
      password: undefined,
      messenger: undefined,
      role: [],
      stack: [],
      size: undefined,
      roleAssoc: []
    };
  }
  register = async e => {
    e.preventDefault();
    console.log("here");

    let data = new FormData();

    let inputs = Object.keys(this.state);
    inputs.forEach(input => {
      data.append(input, this.state[input]);
    });
    data.append("eventID", this.props.eventID);

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

  handleInput = e => {
    let input = e.target.name;
    if (input === "role" || input === "stack" || input === "roleAssoc") {
      if (this.state[input].includes(e.target.value)) {
        this.state[input].splice(this.state[input].indexOf(e.target.value), 1);
      } else {
        this.state[input].push(e.target.value);
      }
      console.log(this.state);
    } else {
      this.setState({ [input]: e.target.value });
      console.log(this.state);
    }

    // username: undefined,
    // email: undefined,
    // password: undefined,
    // messenger: undefined,
    // role: [],
    // stack: [],
    // size: undefined,
    // roleAssoc: []
  };

  render() {
    return (
      <section>
        <form onSubmit={this.register}>
          <input
            type="text"
            onChange={this.handleInput}
            name="username"
            placeholder="username"
            required
          />

          <input
            type="text"
            onChange={this.handleInput}
            name="email"
            placeholder="email"
            required
          />

          <input
            type="text"
            onChange={this.handleInput}
            name="password"
            placeholder="password"
            required
          />

          <input
            type="text"
            onChange={this.handleInput}
            name="messenger"
            placeholder="messenger"
            required
          />

          <label>role</label>
          <form onChange={this.handleInput}>
            <label for="pt-design">Design</label>
            <input name="role" value="design" id="pt-design" type="checkbox" />
            <label for="pt-frontend">Frontend</label>
            <input
              name="role"
              value="frontend"
              id="pt-frontend"
              type="checkbox"
            />
            <label for="pt-backend">Backend</label>
            <input
              name="role"
              value="backend"
              id="pt-backend"
              type="checkbox"
            />
          </form>

          <label>Stack</label>
          <form onChange={this.handleInput}>
            <label for="pt-mean">MEAN</label>
            <input name="stack" value="mean" id="pt-mean" type="checkbox" />
            <label for="pt-mern">MERN</label>
            <input name="stack" value="mern" id="pt-mern" type="checkbox" />
            <label for="pt-python">Python Django</label>
            <input name="stack" value="python" id="pt-python" type="checkbox" />
            <label for="pt-lamp">LAMP</label>
            <input name="stack" value="lamp" id="pt-lamp" type="checkbox" />
            <label for="pt-net">.NET</label>
            <input name="stack" value="net" id="pt-net" type="checkbox"></input>
            <label for="pt-ruby">Ruby on Rails</label>
            <input name="stack" value="ruby" id="pt-ruby" type="checkbox" />
          </form>

          <input
            type="number"
            max={parseInt(this.props.maxTeamSize)}
            onChange={this.handleInput}
            name="size"
            placeholder="size"
            required
          />

          <label>Looking for teammates for these roles</label>
          <form onChange={this.handleInput}>
            <label for="roleAssoc-design">Design</label>
            <input
              name="roleAssoc"
              value="design"
              id="roleAssoc-design"
              type="checkbox"
            />
            <label for="roleAssoc-frontend">Frontend</label>
            <input
              name="roleAssoc"
              value="frontend"
              id="roleAssoc-frontend"
              type="checkbox"
            />
            <label for="roleAssoc-backend">Backend</label>
            <input
              name="roleAssoc"
              value="backend"
              id="roleAssoc-backend"
              type="checkbox"
            />
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
