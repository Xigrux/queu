import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PTDash from "./PTDash";
import OGDash from "./OGDash";
import UpdateCreds from "./UpdateCreds";

class dash extends Component {
  constructor(props) {
    super(props);
    this.state = {
      eventObj: {},
      PTTotal: undefined
    };
  }

  componentWillMount = async () => {
    // getting event data and passing to global state
    let data = new FormData();
    data.append("eventID", this.props.match.params.eventID);
    let response = await fetch("/get-event", { method: "POST", body: data });
    let resBody = await response.text();
    let resObj = JSON.parse(resBody);
    this.setState({
      eventObj: resObj.eventObject,
      PTTotal: resObj.participantsTotal
    });
    this.props.dispatch({ type: "load-event", eventObj: this.state.eventObj });
  };

  render() {
    console.log(this.props);
    return (
      <section>
        {/* if logged in as OG*/}
        {this.props.authStatus.type === "OG" && (
          <OGDash eventObj={this.state.eventObj} PTTotal={this.state.PTTotal} />
        )}
        {/* if logged in as PT*/}
        {this.props.authStatus.type === "PT" && (
          <PTDash eventObj={this.state.eventObj} />
        )}

        <UpdateCreds></UpdateCreds>
      </section>
    );
  }
}

let propList = global => {
  return { authStatus: global.authStatus };
};

let Dash = connect(propList)(withRouter(dash));

export default Dash;
