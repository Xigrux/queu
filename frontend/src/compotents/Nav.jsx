import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import SignIn from "./SignIn";
import "../styles/nav.css";

class nav extends Component {
  componentDidMount = () => {
    console.log(this.props);
  };
  logout = async () => {
    let response = await fetch("/logout");
    let resBody = await response.text();
    console.log(resBody);
    this.props.dispatch({ type: "logout" });
  };

  openSignin = e => {
    e.preventDefault();
    console.log("here");
    document.getElementById("modal").classList = "modal-open";
    document.getElementById("signIn").classList += " open";
  };

  render() {
    return (
      <>
        <nav class="flex-container flex-dir-h flex-end-h blur">
          {!this.props.isLoggedIn && (
            <span>
              <Link to="/event/create-a-queu">
                <button class="nav-button">Create a Queu for my event</button>
              </Link>

              <button class="nav-button" onClick={this.openSignin}>
                Sign In
              </button>
            </span>
          )}

          {this.props.isLoggedIn && (
            <form onSubmit={this.logout}>
              <button>Sign Out</button>
            </form>
          )}

          <Link to="/">
            <div className={"nav-logo"}></div>
          </Link>
        </nav>
        <div class="nav-modal" id="signIn">
          <SignIn />
        </div>
      </>
    );
  }
}

let propList = () => {
  return {};
};

let Nav = connect()(withRouter(nav));

export default Nav;
