import React, { Component } from "react";
import { connect } from "react-redux";

class ptdash extends Component {
  componentDidMount() {}
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
