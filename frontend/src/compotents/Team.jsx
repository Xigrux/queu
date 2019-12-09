import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

class team extends Component {
  constructor(props) {
    super(props);
    this.state = {
      disabled: false,
      hidden: true,
      confirmation: undefined,
      finalConfirmation: undefined
    };
  }
  option = e => {
    e.preventDefault();
    this.setState({ hidden: false, confirmation: e.target.value });
    console.log("option", e.target.value, this.state);
  };

  confirm = async e => {
    e.preventDefault();
    if (e.target.value === "true") {
      let data = new FormData();
      data.append("PTresponse", this.state.confirmation);
      data.append("participantID", this.props.participantID);
      let response = await fetch("/confirmation", {
        method: "POST",
        body: data
      });
      let resBody = await response.text();
      let teamModification = JSON.parse(resBody);
      if (teamModification.success) {
        this.setState({
          disabled: true,
          hidden: true,
          finalConfirmation: this.state.confirmation
        });
        if (teamModification.isTeamComplete) {
          // do something
          console.log(teamModification.isTeamComplete);
        }
      }
    } else {
      this.setState({
        disabled: false,
        hidden: true,
        confirmation: undefined,
        finalConfirmation: undefined
      });
    }
  };

  render() {
    return (
      <section>
        <ul>
          {this.props.teammateArr.map(teammate => {
            console.log(teammate, this.props.participantID);
            if (teammate.participantID !== this.props.participantID) {
              return (
                <li>
                  {console.log(teammate.status, teammate)}
                  {teammate.username}:{" "}
                  {teammate.status
                    ? "Confirmed"
                    : teammate.status !== null
                    ? "Declined"
                    : "Unconfirmed"}
                </li>
              );
            }
            if (
              teammate.participantID === this.props.participantID &&
              this.state.finalConfirmation === undefined
            ) {
              return (
                <>
                  <li>
                    {console.log(teammate.status, teammate)}
                    {teammate.username}:{" "}
                    {teammate.status ? (
                      "Confimed"
                    ) : (
                      <span>
                        <button
                          onClick={this.option}
                          disabled={this.state.disabled}
                          value={true}
                        >
                          Confirm
                        </button>
                        <button
                          onClick={this.option}
                          disabled={this.state.disabled}
                          value={false}
                        >
                          Decline
                        </button>
                      </span>
                    )}
                  </li>
                  <div hidden={this.state.hidden}>
                    Are you sure?
                    <button onClick={this.confirm} value={true}>
                      Yes, I would like to{" "}
                      {this.state.confirmation === "true"
                        ? "confirm my addition to this team."
                        : "decline my addition to this team."}
                    </button>
                    <button onClick={this.confirm} value={false}>
                      Cancel
                    </button>
                  </div>
                </>
              );
            } else if (
              teammate.participantID === this.props.participantID &&
              this.state.finalConfirmation !== undefined
            ) {
              return (
                <>
                  <li>
                    {teammate.username}:{" "}
                    {this.state.finalConfirmation === "true"
                      ? "Confirmed"
                      : "Declined"}
                  </li>
                </>
              );
            }
          })}
        </ul>
      </section>
    );
  }
}

let propList = globalState => {
  return { participantID: globalState.participantObj.participantID };
};

let Team = connect(propList)(team);

export default Team;
