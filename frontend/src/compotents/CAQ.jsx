import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

class caq extends Component {
  createQueu = async () => {
    let response = await fetch("/create-a-queu", {
      method: "POST",
      cors: "no-cors"
    });

    let body = await response.text();
  };
  render() {
    return (
      <section>
        create a queu
        <form onSubmit={this.createQueu}></form>
      </section>
    );
  }
}

let propList = () => {
  return {};
};

let CAQ = connect(propList)(caq);

export default CAQ;
