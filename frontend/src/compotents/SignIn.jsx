import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import "../styles/signin.css";
import { FiXCircle } from "react-icons/fi";

class signin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: undefined,
      password: undefined
    };
  }

  componentDidMount = async () => {
    console.log("here");

    let wildCards = this.props.location.pathname.split("/").splice(2, 2);
    let eventID = wildCards[0];
    let email = wildCards[1];

    if (eventID && email) {
      let data = new FormData();
      data.append("eventID", eventID);
      let response = await fetch("/get-event", { method: "POST", body: data });
      let resBody = await response.text();
      let resObj = JSON.parse(resBody);
      document.getElementById("signIn").classList += " open";
      this.setState({ email });
      this.setState({
        eventObj: resObj.eventObject
      });
      this.props.dispatch({ type: "load-event", eventObj: resObj.eventObject });

      document.documentElement.style.setProperty(
        "--bg-color",
        this.state.eventObj.background
      );
      document.documentElement.style.setProperty(
        "--font-color",
        this.state.eventObj.font
      );
    }
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
      this.props.dispatch({
        type: "load-eventObj",
        eventObj: userData
      });
      console.log("dispatching OG");
      this.props.dispatch({
        type: "login",
        authStatus: { type: "OG", isLoggedIn: true }
      });
      document.getElementById("modal").classList = "";
      document.getElementById("signIn").classList = "nav-modal";
      return this.props.history.push("/" + userData.eventID);
    }
  };

  closeModal = e => {
    e.preventDefault();
    document.getElementById("modal").classList = "";
    document.getElementById("signIn").classList = "nav-modal";
  };

  render() {
    return (
      <div class="signin-toast">
        <form
          class="signin-form flex-dir-v flex-container flex-center-h flex-center-v"
          onSubmit={this.signin}
        >
          <div class="input-label-container">
            <input
              onChange={this.handleInput}
              type="text"
              name="email"
              id="email"
              placeholder=" "
              value={this.state.email === undefined ? "" : this.state.email}
            ></input>
            <label for="email">Email</label>
          </div>
          <div class="input-label-container">
            <input
              onChange={this.handleInput}
              type="text"
              name="password"
              id="password"
              placeholder=" "
            ></input>
            <label for="password">Password</label>
          </div>

          <button type="submit">Sign in</button>
        </form>
        <div class="signin-close" onClick={this.closeModal}>
          <FiXCircle />
        </div>
      </div>
    );
  }
}

let propList = () => {
  return {};
};

let SignIn = connect(propList)(withRouter(signin));

export default SignIn;
