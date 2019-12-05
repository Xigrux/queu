import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";

class signin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: undefined,
      password: undefined
    };
  }

  componentDidMount = async () => {
    this.setState({ email: this.props.match.params.paticipantEmail });
  };

  handleInput = e => {
    e.preventDefault();
    let input = e.target.name;
    this.setState({ [input]: e.target.value });
  };

  signin = async e => {
    e.preventDefault();

    let data = new FormData();
    let inputs = Object.keys(this.state);
    inputs.forEach(input => {
      data.append(input, this.state[input]);
    });
    let response = await fetch("/signin", {
      method: "POST",
      body: data
      // cors: "no-cors"
    });
    let resBody = await response.text();
    let userData = JSON.parse(resBody);

    if (userData.participantID) {
      // if the user is an PT
      this.props.dispatch({
        type: "load-participantObj",
        participantObj: userData
      });
      this.props.dispatch({
        type: "login",
        authStatus: { type: "PT", isLoggedIn: true }
      });
      return this.props.history.push("/" + userData.eventID);
    } else if (userData.event) {
      // if the user is an OG
      console.log("dispatching OG");
      this.props.dispatch({
        type: "login",
        authStatus: { type: "OG", isLoggedIn: true }
      });
      return this.props.history.push("/" + userData.eventID);
    }
  };

  render() {
    return (
      <section>
        <form onSubmit={this.signin}>
          <input
            onChange={this.handleInput}
            type="text"
            name="email"
            placeholder="email"
            value={this.state.email === undefined ? "" : this.state.email}
          ></input>
          <input
            onChange={this.handleInput}
            type="text"
            name="password"
            placeholder="password"
          ></input>
          <button type="submit">Sign in</button>
        </form>
      </section>
    );
  }
}

let propList = () => {
  return {};
};

let SignIn = connect(propList)(withRouter(signin));

export default SignIn;
