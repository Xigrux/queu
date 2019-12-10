import React, { Component } from "react";
import { connect } from "react-redux";

class ogdash extends Component {
  makeTeam = async e => {
    console.log("clicked, gonna run algo");
    e.preventDefault();
    let data = new FormData();
    data.append("eventID", this.props.eventObj.eventID);
    let response = await fetch("/maketeam", {
      method: "POST",
      body: data
    });

    let resBody = await response.text();
    console.log(resBody);
  };
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
        <div>there are {this.props.PTTeamedUp} are teamed up</div>
        <button onClick={this.makeTeam}>Quen in teams</button>
      </section>
    );
  }
}

let propList = () => {
  return {};
};

let OGDash = connect(propList)(ogdash);

export default OGDash;
