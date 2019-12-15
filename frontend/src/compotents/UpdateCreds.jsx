import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import "../styles/update.css";

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
        <h1>Update your crendentials</h1>
        <form
          class="flex-container flex-center-v update-form"
          onSubmit={this.updateCreds}
        >
          <div class="input-label-container">
            <input
              onChange={this.handleInput}
              type="text"
              name="newEmail"
              placeholder=" "
              value={
                this.state.newEmail === undefined ? "" : this.state.newEmail
              }
              id="update-email"
            ></input>
            <label for="update-emai">New Email</label>
          </div>
          <div class="input-label-container">
            <input
              onChange={this.handleInput}
              type="text"
              name="newPassword"
              placeholder=" "
              id="update-password"
            ></input>
            <label for="update-password">New Password</label>
          </div>
          <button class="update-submit" type="submit">
            Update
          </button>
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
