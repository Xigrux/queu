import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PTRegistration from "./PTRegistration";

class landing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      eventName: ""
    };
  }

  componentDidMount() {
    this.setState({ eventName: this.props.match.params.eventID });
  }

  render() {
    if (this.props.match.params.eventID) {
      return (
        <section>
          Going to {this.state.eventName} but don't have a team? Sign up as a
          participant here
          <PTRegistration></PTRegistration>
        </section>
      );
    } else {
      return <section>welcome to queu</section>;
    }
  }
}

let propList = () => {
  return {};
};

let Landing = connect(propList)(withRouter(landing));

export default Landing;
