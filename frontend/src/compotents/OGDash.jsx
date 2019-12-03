import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

class ogdash extends Component {
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
    return (
      <section>
        organizer dashboard for {this.state.eventObj.event}
        <div>
          here's the link you can send :{" "}
          {window.location.origin + "/" + this.state.eventObj.eventID}
        </div>
      </section>
    );
  }
}

let propList = () => {
  return {};
};

let OGDash = connect(propList)(withRouter(ogdash));

export default OGDash;
