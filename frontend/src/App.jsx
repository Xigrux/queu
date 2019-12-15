import React, { Component } from "react";
import { BrowserRouter, Route, Link } from "react-router-dom";
import { connect } from "react-redux";

import Nav from "./compotents/Nav";
import Footer from "./compotents/Footer";
import Landing from "./compotents/Landing";
import Dash from "./compotents/Dash";
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
          <div class="blur">
            <Route path="/" exact={true}>
              <Landing />
            </Route>

            {/* renders for root page */}
            <Route path="/:eventID" exact={true}>
              {/* if no logged in */}
              {!this.props.authStatus.isLoggedIn && <Landing />}
              {/* if logged in */}
              {this.props.authStatus.isLoggedIn && <Dash />}
            </Route>

            <Route path="email/:eventID/:paticipantEmail" exact={true}>
              {/* if no logged in */}
              {!this.props.authStatus.isLoggedIn && <SignIn />}
              {/* if logged in */}
              {this.props.authStatus.isLoggedIn && <Dash />}
            </Route>

            <Route path="/event/create-a-queu" exact={true}>
              <CAQ />
            </Route>
          </div>
        </BrowserRouter>
        {/* <Footer></Footer> */}
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
