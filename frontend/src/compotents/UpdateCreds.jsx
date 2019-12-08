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
    let input;
    if (e.target.name !== "") {
      input = e.target.name;
    } else {
      input = undefined;
    }
    this.setState({ [input]: e.target.value });
  };

  updateCreds = async e => {
    e.preventDefault();
    console.log("here");
    let data = new FormData();
    let inputs = Object.keys(this.state);
    inputs.forEach(input => {
      data.append(input, this.state[input]);
    });
    data.append("oldEmail", this.props.oldEmail);
    data.append("userType", this.props.userType);
    let response = await fetch("/updatecreds", {
      method: "POST",
      body: data
      // cors: "no-cors"
    });
    let resBody = await response.text();
    let success = JSON.parse(resBody);
    if (success) {
      console.log(success);
    }
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
          <button type="submit">Update</button>
        </form>
      </section>
    );
  }
}

let propList = globalState => {
  return {
    oldEmail: globalState.participantObj
      ? globalState.participantObj.email
      : globalState.eventObj.email,
    userType: globalState.authStatus.type
  };
};

let UpdateCreds = connect(propList)(updateCreds);

export default UpdateCreds;
