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

    let participantObj = JSON.parse(resBody);

    if (participantObj) {
      this.props.dispatch({
        type: "load-participantObj",
        participantObj: participantObj
      });
      this.props.dispatch({
        type: "login",
        authStatus: { type: "PT", isLoggedIn: true }
      });
    }
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
    }
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
          <div onChange={this.handleInput}>
            <label htmlFor="pt-design">Design</label>
            <input name="role" value="design" id="pt-design" type="checkbox" />
            <label htmlFor="pt-frontend">Frontend</label>
            <input
              name="role"
              value="frontend"
              id="pt-frontend"
              type="checkbox"
            />
            <label htmlFor="pt-backend">Backend</label>
            <input
              name="role"
              value="backend"
              id="pt-backend"
              type="checkbox"
            />
          </div>

          <label>Stack</label>
          <div onChange={this.handleInput}>
            <label htmlFor="pt-mean">MEAN</label>
            <input name="stack" value="mean" id="pt-mean" type="checkbox" />
            <label htmlFor="pt-mern">MERN</label>
            <input name="stack" value="mern" id="pt-mern" type="checkbox" />
            <label htmlFor="pt-python">Python Django</label>
            <input name="stack" value="python" id="pt-python" type="checkbox" />
            <label htmlFor="pt-lamp">LAMP</label>
            <input name="stack" value="lamp" id="pt-lamp" type="checkbox" />
            <label htmlFor="pt-net">.NET</label>
            <input name="stack" value="net" id="pt-net" type="checkbox"></input>
            <label htmlFor="pt-ruby">Ruby on Rails</label>
            <input name="stack" value="ruby" id="pt-ruby" type="checkbox" />
          </div>

          {/* wtf why is this NaN at the beginning  */}
          <input
            type="number"
            max={parseInt(this.props.maxTeamSize) - 1}
            min="0"
            onChange={this.handleInput}
            name="size"
            placeholder="1"
            required
          />

          <label>Looking for teammates for these roles</label>
          <div onChange={this.handleInput}>
            <label htmlFor="roleAssoc-design">Design</label>
            <input
              name="roleAssoc"
              value="design"
              id="roleAssoc-design"
              type="checkbox"
            />
            <label htmlFor="roleAssoc-frontend">Frontend</label>
            <input
              name="roleAssoc"
              value="frontend"
              id="roleAssoc-frontend"
              type="checkbox"
            />
            <label htmlFor="roleAssoc-backend">Backend</label>
            <input
              name="roleAssoc"
              value="backend"
              id="roleAssoc-backend"
              type="checkbox"
            />
          </div>

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
