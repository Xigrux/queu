import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

class team extends Component {
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
                  {teammate.status ? "Confimed" : "Unconfirmed"}
                </li>
              );
            }
            if (teammate.participantID === this.props.participantID) {
              return (
                <li>
                  {console.log(teammate.status, teammate)}
                  {teammate.username}:{" "}
                  {teammate.status ? (
                    "Confimed"
                  ) : (
                    <span>
                      <button>Confirm</button>
                      <button>Decline</button>
                    </span>
                  )}
                </li>
              );
            }
          })}
        </ul>
      </section>
    );
  }
}

let propList = () => {
  return {};
};

let Team = connect(propList)(team);

export default Team;
