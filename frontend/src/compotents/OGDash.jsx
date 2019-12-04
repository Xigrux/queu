import React, { Component } from "react";
import { connect } from "react-redux";

class ogdash extends Component {
  render() {
    console.log(this.props);
    return (
      <section>
        organizer dashboard for {this.props.eventObj.event}
        <div>
          here's the link you can send :{" "}
          {window.location.origin + "/" + this.props.eventObj.eventID}
        </div>
        <div>there are {this.props.PTTotal} participants</div>
      </section>
    );
  }
}

let propList = () => {
  return {};
};

let OGDash = connect(propList)(ogdash);

export default OGDash;
