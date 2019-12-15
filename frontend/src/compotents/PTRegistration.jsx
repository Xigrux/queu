import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import "../styles/ptr.css";

class ptregistration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: undefined,
      email: undefined,
      password: undefined,
      messenger: undefined,
      role: [],
      stack: [],
      size: undefined,
      roleAssoc: []
    };
  }
  register = async e => {
    e.preventDefault();

    let data = new FormData();

    let inputs = Object.keys(this.state);
    inputs.forEach(input => {
      data.append(input, this.state[input]);
    });
    data.append("eventID", this.props.eventID);

    let response = await fetch("/register", {
      method: "POST",
      body: data
    });

    let resBody = await response.text();

    let participantObj = JSON.parse(resBody);

    if (participantObj) {
      this.props.dispatch({
        type: "load-participantObj",
        participantObj: participantObj
      });
      this.props.dispatch({
        type: "login",
        authStatus: { type: "PT", isLoggedIn: true }
      });
    }
  };

  handleInput = e => {
    let input = e.target.name;
    if (input === "role" || input === "stack" || input === "roleAssoc") {
      if (this.state[input].includes(e.target.value)) {
        this.state[input].splice(this.state[input].indexOf(e.target.value), 1);
      } else {
        this.state[input].push(e.target.value);
      }

      console.log(this.state);
    } else {
      this.setState({ [input]: e.target.value });
    }
  };

  render() {
    return (
      <>
        <form onSubmit={this.register} class="flex-container flex-dir-v">
          <div class="flex-container">
            <section class="ptr-section">
              <h1>Accound setup</h1>
              <div class="input-label-container">
                <input
                  type="text"
                  onChange={this.handleInput}
                  name="username"
                  placeholder=" "
                  id="PTR-username"
                  required
                />
                <label for="PTR-username">Username</label>
              </div>
              <div class="input-label-container">
                <input
                  type="text"
                  onChange={this.handleInput}
                  name="email"
                  placeholder=" "
                  id="PTR-email"
                  required
                />
                <label for="PTR-email">Email</label>
              </div>
              <div class="input-label-container">
                <input
                  type="text"
                  onChange={this.handleInput}
                  name="password"
                  placeholder=" "
                  id="PTR-password"
                  required
                />
                <label for="PTR-password">Password</label>
              </div>
              <div class="input-label-container">
                <input
                  type="text"
                  onChange={this.handleInput}
                  name="messenger"
                  placeholder=" "
                  id="PTR-messenger"
                  required
                />
                <label for="PTR-messenger">Messenger Handle</label>
              </div>
            </section>
            <section class="ptr-section">
              <h1>Participant Detail</h1>
              <h5>Role</h5>
              <div class="flex-container" onChange={this.handleInput}>
                <div class="input-label-container-check">
                  <label htmlFor="pt-design">Design</label>
                  <input
                    name="role"
                    value="design"
                    id="pt-design"
                    type="checkbox"
                  />
                </div>
                <div class="input-label-container-check">
                  <label htmlFor="pt-frontend">Frontend</label>
                  <input
                    name="role"
                    value="frontend"
                    id="pt-frontend"
                    type="checkbox"
                  />
                </div>
                <div class="input-label-container-check">
                  <label htmlFor="pt-backend">Backend</label>
                  <input
                    name="role"
                    value="backend"
                    id="pt-backend"
                    type="checkbox"
                  />
                </div>
              </div>
              <h5>Stack</h5>
              <div class="flex-container" onChange={this.handleInput}>
                <div class="input-label-container-check">
                  <label htmlFor="pt-mean">MEAN</label>
                  <input
                    name="stack"
                    value="mean"
                    id="pt-mean"
                    type="checkbox"
                  />
                </div>
                <div class="input-label-container-check">
                  <label htmlFor="pt-mern">MERN</label>
                  <input
                    name="stack"
                    value="mern"
                    id="pt-mern"
                    type="checkbox"
                  />
                </div>
                <div class="input-label-container-check">
                  <label htmlFor="pt-python">Python Django</label>
                  <input
                    name="stack"
                    value="python"
                    id="pt-python"
                    type="checkbox"
                  />
                </div>
                <div class="input-label-container-check">
                  <label htmlFor="pt-lamp">LAMP</label>
                  <input
                    name="stack"
                    value="lamp"
                    id="pt-lamp"
                    type="checkbox"
                  />
                </div>
                <div class="input-label-container-check">
                  <label htmlFor="pt-net">.NET</label>
                  <input
                    name="stack"
                    value="net"
                    id="pt-net"
                    type="checkbox"
                  ></input>
                </div>
                <div class="input-label-container-check">
                  <label htmlFor="pt-ruby">Ruby on Rails</label>
                  <input
                    name="stack"
                    value="ruby"
                    id="pt-ruby"
                    type="checkbox"
                  />
                </div>
              </div>
            </section>
          </div>

          <section class="ptr-section flex-container flex-dir-v">
            <h1>Team Preference</h1>
            <div class="flex-container fullPwidth">
              {/* wtf why is this NaN at the beginning  */}
              <div class="flex-container ptr-preferred-section flex-dir-v">
                <h5>Preferred team size</h5>
                <input
                  type="number"
                  max={parseInt(this.props.maxTeamSize) - 1}
                  min="0"
                  onChange={this.handleInput}
                  name="size"
                  placeholder="1"
                  required
                />
              </div>

              <div class="flex-container ptr-preferred-section flex-dir-v">
                <h5>Looking for teammates for these roles</h5>
                <div class="flex-container" onChange={this.handleInput}>
                  <div class="input-label-container-check">
                    <label htmlFor="roleAssoc-design">Design</label>
                    <input
                      name="roleAssoc"
                      value="design"
                      id="roleAssoc-design"
                      type="checkbox"
                    />
                  </div>
                  <div class="input-label-container-check">
                    <label htmlFor="roleAssoc-frontend">Frontend</label>
                    <input
                      name="roleAssoc"
                      value="frontend"
                      id="roleAssoc-frontend"
                      type="checkbox"
                    />
                  </div>
                  <div class="input-label-container-check">
                    <label htmlFor="roleAssoc-backend">Backend</label>
                    <input
                      name="roleAssoc"
                      value="backend"
                      id="roleAssoc-backend"
                      type="checkbox"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <button type="submit">signup</button>
        </form>
      </>
    );
  }
}

let propList = () => {
  return {};
};

let PTRegistration = connect(propList)(ptregistration);

export default PTRegistration;
