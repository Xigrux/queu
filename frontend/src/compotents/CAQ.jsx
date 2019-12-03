import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";

class caq extends Component {
  constructor(props) {
    super(props);
    this.state = {
      event: undefined,
      email: undefined,
      password: undefined,
      maxTeamSize: undefined
    };
  }

  createQueu = async e => {
    e.preventDefault();

    let data = new FormData();
    let inputs = Object.keys(this.state);
    inputs.forEach(input => {
      data.append(input, this.state[input]);
    });

    let response = await fetch("/create-a-queu", {
      method: "POST",
      body: data
      // cors: "no-cors"
    });
    let resBody = await response.text();
    let eventID = JSON.parse(resBody);

    this.props.dispatch({
      type: "login",
      authStatus: { type: "OG", isLoggedIn: true }
    });

    this.props.history.push("/" + eventID);
  };

  handleInput = e => {
    e.preventDefault();
    let input = e.target.name;
    this.setState({ [input]: e.target.value });
  };

  render() {
    return (
      <section>
        <form onSubmit={this.createQueu}>
          <input
            onChange={this.handleInput}
            type="text"
            name="event"
            placeholder="event"
          ></input>
          <input
            onChange={this.handleInput}
            type="text"
            name="email"
            placeholder="email"
          ></input>
          <input
            onChange={this.handleInput}
            type="text"
            name="password"
            placeholder="password"
          ></input>
          <input
            onChange={this.handleInput}
            type="number"
            name="maxTeamSize"
            placeholder="max team size"
          ></input>
          <button type="submit">Create my Queu</button>
        </form>
      </section>
    );
  }
}

let propList = () => {
  return {};
};

let CAQ = connect(propList)(withRouter(caq));

export default CAQ;
