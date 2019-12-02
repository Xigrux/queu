import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PTRegistration from "./PTRegistration";

class landing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      event: undefined
    };
  }

  componentDidMount = async () => {
    let data = new FormData();
    data.append("eventID", this.props.match.params.eventID);

    let response = await fetch("/get-event", { method: "POST", body: data });

    let resBody = await response.text();

    let eventObj = JSON.parse(resBody);
    console.log(eventObj);

    this.setState({ event: eventObj.event });
  };

  render() {
    if (this.props.match.params.eventID) {
      return (
        <section>
          Going to {this.state.event} but don't have a team? Sign up as a
          participant here
          <PTRegistration></PTRegistration>
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
