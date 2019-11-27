import React, { Component } from "react";
import { BrowserRouter, Route, Link } from "react-router-dom";
import { connect } from "react-redux";

import Nav from "./compotents/Nav";
import Footer from "./compotents/Footer";
import Landing from "./compotents/Landing";
import PTDash from "./compotents/PTDash";
import OGDash from "./compotents/OGDash";
import CAQ from "./compotents/CAQ";
import SignIn from "./compotents/SignIn";

class app extends Component {
  render() {
    return (
      <>
        <BrowserRouter>
          <Nav
            // send the authentication status
            isLoggedIn={this.props.authStatus.isLoggedIn}
            userType={this.props.authStatus.type}
          ></Nav>

          {/* renders for root page */}
          <Route path="/" exact={true}>
            {/* if no logged in */}
            {!this.props.authStatus.isLoggedIn && <Landing />}
            {/* if logged in as OG*/}
            {this.props.authStatus.isLoggedIn &&
              this.props.authStatus.type === "OG" && <OGDash />}
            {/* if logged in as PT*/}
            {this.props.authStatus.isLoggedIn &&
              this.props.authStatus.type === "PT" && <PTDash />}
          </Route>

          <Route path="/create-a-queu">
            <CAQ />
          </Route>

          <Route path="/signin">
            <SignIn />
          </Route>
        </BrowserRouter>
        <Footer></Footer>
      </>
    );
  }
}

let propList = global => {
  return {
    authStatus: global.authStatus
  };
};

let App = connect(propList)(app);

export default App;
