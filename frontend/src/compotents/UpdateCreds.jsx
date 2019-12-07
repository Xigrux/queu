import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

class updateCreds extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newEmail: undefined,
      newPassword: undefined
    };
  }
  handleInput = e => {
    e.preventDefault();
    let input = e.target.name;
    this.setState({ [input]: e.target.value });
  };

  updateCreds = async () => {
    let data = new FormData();
    let inputs = Object.keys(this.state);
    inputs.forEach(input => {
      data.append(input, this.state[input]);
    });
    data.append("oldEmail", this.props.oldEmail);
    let response = await fetch("/updatecreds", {
      method: "POST",
      body: data
      // cors: "no-cors"
    });
    let resBody = await response.text();
    let userData = JSON.parse(resBody);
  };
  render() {
    return (
      <section>
        <form onSubmit={this.updateCreds}>
          <input
            onChange={this.handleInput}
            type="text"
            name="newEmail"
            placeholder="newEmail"
            value={this.state.newEmail === undefined ? "" : this.state.newEmail}
          ></input>
          <input
            onChange={this.handleInput}
            type="text"
            name="newPassword"
            placeholder="newPassword"
          ></input>
          <button type="submit">Sign in</button>
        </form>
      </section>
    );
  }
}

let propList = globalState => {
  return {
    oldEmail: globalState.participantObj
      ? globalState.participantObj.email
      : globalState.eventObj.email
  };
};

let UpdateCreds = connect(propList)(updateCreds);

export default UpdateCreds;
