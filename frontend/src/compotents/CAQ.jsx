import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

class caq extends Component {
  createQueu = () => {};
  render() {
    return (
      <section>
        create a queu
        <form onSubmit={this.createQueu}>
          <button>Create my Queu</button>
        </form>
      </section>
    );
  }
}

let propList = () => {
  return {};
};

let CAQ = connect(propList)(caq);

export default CAQ;
