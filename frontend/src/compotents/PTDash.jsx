import React, { Component } from "react";
import { connect } from "react-redux";
import Team from "./Team";

class ptdash extends Component {
  constructor(props) {
    super(props);
    this.state = {
      teammateArr: []
    };
  }
  componentDidMount = async () => {
    let data = new FormData();

    data.append("participantID", this.props.participantObj.participantID);

    let response = await fetch("/getteam", {
      method: "POST",
      body: data
      // cors: "no-cors"
    });
    let resBody = await response.text();
    let teammateArr = JSON.parse(resBody);
    this.setState({ teammateArr });
  };
  render() {
    return (
      <section>
        {this.props.participantObj.username}'s participant dashboard for{" "}
        {this.props.eventObj.event}{" "}
        {this.state.teammateArr[0] && (
          <Team
            teammateArr={this.state.teammateArr}
            participantID={this.props.participantObj.participantID}
          ></Team>
        )}
      </section>
    );
  }
}

let propList = globalState => {
  return { participantObj: globalState.participantObj };
};

let PTDash = connect(propList)(ptdash);

export default PTDash;
