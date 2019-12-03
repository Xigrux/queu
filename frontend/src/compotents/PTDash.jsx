import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

class ptdash extends Component {
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
    console.log(this.props);
    return (
      <section>
        participant dashboard{this.state.eventObj.event}{" "}
        {this.props.participantObj.username}
      </section>
    );
  }
}

let propList = globalState => {
  return { participantObj: globalState.participantObj };
};

let PTDash = connect(propList)(withRouter(ptdash));

export default PTDash;
