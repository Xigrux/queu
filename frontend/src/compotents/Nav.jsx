import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

class nav extends Component {
  logout = () => {
    this.props.dispatch({ type: "logout" });
  };

  render() {
    return (
      <nav>
        {!this.props.isLoggedIn && (
          <span>
            <Link to="/create-a-queu">
              <button>Create a Queu for my event</button>
            </Link>
            <Link to="/signin">
              <button>Sign In</button>
            </Link>
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

let Nav = connect()(nav);

export default Nav;
