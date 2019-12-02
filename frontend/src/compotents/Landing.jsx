import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PTRegistration from "./PTRegistration";

class landing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      eventObj: {}
    };
  }

  componentDidMount = async () => {
    // getting event data and passing to global state
    let data = new FormData();
    data.append("eventID", this.props.match.params.eventID);
    let response = await fetch("/get-event", { method: "POST", body: data });
    let resBody = await response.text();
    let eventObj = JSON.parse(resBody);
    this.setState({
      eventObj
    });
    this.props.dispatch({ type: "load-event", eventObj: eventObj });
  };

  render() {
    if (this.props.match.params.eventID) {
      return (
        <section>
          Going to <b>{this.state.eventObj.event}</b> but don't have a team?
          Sign up as a participant here
          <PTRegistration
            maxTeamSize={this.state.eventObj.maxTeamSize}
            eventID={this.state.eventObj.eventID}
          ></PTRegistration>
        </section>
      );
    } else {
      return <section>welcome to queu</section>;
    }
  }
}

let propList = () => {
  return {};
};

let Landing = connect(propList)(withRouter(landing));

export default Landing;
