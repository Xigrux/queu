import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PTRegistration from "./PTRegistration";
import "../styles/landing.css";

class landing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      eventObj: {}
    };
  }

  componentWillMount = async () => {
    // getting event data and passing to global state
    console.log(this.props.match);
    if (this.props.match.params.eventID) {
      let data = new FormData();
      data.append("eventID", this.props.match.params.eventID);
      let response = await fetch("/get-event", { method: "POST", body: data });
      let resBody = await response.text();
      let resObj = JSON.parse(resBody);
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

  render() {
    if (this.props.match.params.eventID) {
      return (
        <section
        // style={{
        //   backgroundColor: this.state.eventObj.background,
        //   color: this.state.eventObj.font
        // }}
        >
          Going to <b>{this.state.eventObj.event}</b> but don't have a team?
          <img src={this.state.eventObj.imagePath} alt=""></img>
          Sign up as a participant here
          <PTRegistration
            maxTeamSize={this.state.eventObj.maxTeamSize}
            eventID={this.state.eventObj.eventID}
          ></PTRegistration>
        </section>
      );
    } else {
      return <section class="landing-not-loggedIn">welcome to queu</section>;
    }
  }
}

let propList = () => {
  return {};
};

let Landing = connect(propList)(withRouter(landing));

export default Landing;
