import React, { Component } from "react";
import { connect } from "react-redux";

class ptdash extends Component {
  componentDidMount = async () => {
    let data = new FormData();

    data.append("participantID", this.props.participantObj.participantID);

    let response = await fetch("/getteam", {
      method: "POST",
      body: data
      // cors: "no-cors"
    });
    let resBody = await response.text();
    let eventID = JSON.parse(resBody);
    console.log(eventID);
  };
  render() {
    return (
      <section>
        {this.props.participantObj.username}'s participant dashboard for{" "}
        {this.props.eventObj.event}{" "}
      </section>
    );
  }
}

let propList = globalState => {
  return { participantObj: globalState.participantObj };
};

let PTDash = connect(propList)(ptdash);

export default PTDash;
