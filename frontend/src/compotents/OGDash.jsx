import React, { Component } from "react";
import { connect } from "react-redux";

class ogdash extends Component {
  componentWillMount = async () => {
    document.documentElement.style.setProperty(
      "--bg-color",
      this.props.eventObj.background
    );
    document.documentElement.style.setProperty(
      "--font-color",
      this.props.eventObj.font
    );
  };
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
        <div>
          there are {this.props.PTTotal}{" "}
          {this.props.PTTotal > 1 ? "participants" : "participant"}
        </div>
        <div>
          there are {this.props.PTTeamedUp}{" "}
          {this.props.PTTeamedUp > 1 ? "participants" : "participant"} who are
          teamed up into {this.props.nbTeams}{" "}
          {this.props.nbTeams > 1 ? "teams" : "team"}
        </div>
        <button onClick={this.makeTeam}>Queu in teams</button>
      </section>
    );
  }
}

let propList = globalState => {
  return { eventObj: globalState.eventObj };
};

let OGDash = connect(propList)(ogdash);

export default OGDash;
