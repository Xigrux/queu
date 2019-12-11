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

  render() {
    return (
      <nav>
        {!this.props.isLoggedIn && (
          <span>
            <Link to="/event/create-a-queu">
              <button>Create a Queu for my event</button>
            </Link>

            <button>Sign In</button>
            <SignIn />
          </span>
        )}

        {this.props.isLoggedIn && (
          <form onSubmit={this.logout}>
            <button>Sign Out</button>
          </form>
        )}

        <Link to="/">
          <span>logo</span>
        </Link>
      </nav>
    );
  }
}

let propList = () => {
  return {};
};

let Nav = connect()(withRouter(nav));

export default Nav;
