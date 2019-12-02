import React, { Component } from "react";
import { Link } from "react-router-dom";
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
    console.log("here");

    let data = new FormData();
    data.append("event", this.state.event);
    data.append("email", this.state.email);
    data.append("password", this.state.password);
    data.append("maxTeamSize", this.state.maxTeamSize);

    let response = await fetch("/create-a-queu", {
      method: "POST",
      body: data
      // cors: "no-cors"
    });

    let resBody = await response.text();
    console.log(resBody);

    this.props.dispatch({
      type: "login",
      authStatus: { type: "PT", isLoggedIn: true }
    });
  };
  handleEvent = e => {
    e.preventDefault();
    this.setState({ event: e.target.value });
    console.log(this.state);
  };

  handleEmail = e => {
    e.preventDefault();
    this.setState({ email: e.target.value });
    console.log(this.state);
  };

  handlePassword = e => {
    e.preventDefault();
    this.setState({ password: e.target.value });
    console.log(this.state);
  };
  handleMaxTeamSize = e => {
    e.preventDefault();
    this.setState({ maxTeamSize: e.target.value });
    console.log(this.state);
  };

  render() {
    return (
      <section>
        <form onSubmit={this.createQueu}>
          <input
            onChange={this.handleEvent}
            type="text"
            name="event"
            placeholder="event"
          ></input>
          <input
            onChange={this.handleEmail}
            type="text"
            name="email"
            placeholder="email"
          ></input>
          <input
            onChange={this.handlePassword}
            type="text"
            name="password"
            placeholder="password"
          ></input>
          <input
            onChange={this.handleMaxTeamSize}
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

let CAQ = connect(propList)(caq);

export default CAQ;
