import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import Spinner from "./UI/Spinner";
import Image from "./UI/Image";
import Button from "./UI/Button";

class caq extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uploading: false,
      image: undefined,
      inputs: {
        event: undefined,
        email: undefined,
        password: undefined,
        maxTeamSize: undefined,
        imagePath: undefined
      }
    };
  }

  removeImage = id => {
    this.setState({
      image: this.state.image.public_id !== id ? this.state.image : undefined
    });
  };

  onChange = async e => {
    e.preventDefault();
    console.log("onchange");
    let files = Array.from(e.target.files);
    this.setState({ uploading: true });

    let data = new FormData();
    data.append("image", files[0]);

    let response = await fetch("/image-upload", {
      method: "POST",
      body: data
    });
    let resBody = await response.text();
    let image = JSON.parse(resBody)[0];
    if (image) {
      this.setState({
        uploading: false,
        image,
        inputs: { ...this.state.inputs, imagePath: image.secure_url }
      });
    }
  };

  createQueu = async e => {
    e.preventDefault();

    let data = new FormData();
    let inputs = Object.keys(this.state.inputs);
    inputs.forEach(input => {
      data.append(input, this.state.inputs[input]);
    });

    let response = await fetch("/create-a-queu", {
      method: "POST",
      body: data
      // cors: "no-cors"
    });
    let resBody = await response.text();
    let eventObj = JSON.parse(resBody);

    this.props.dispatch({
      type: "login",
      authStatus: { type: "OG", isLoggedIn: true }
    });

    this.props.dispatch({
      type: "load-eventObj",
      eventObj
    });

    this.props.history.push("/" + eventObj.eventID);
  };

  handleInput = e => {
    e.preventDefault();
    let input = e.target.name;
    this.setState({
      inputs: { ...this.state.inputs, [input]: e.target.value }
    });
  };

  render() {
    let uploading = this.state.uploading;
    let image = this.state.image;

    console.log(image);

    let content = () => {
      if (uploading) {
        return <Spinner />;
      } else if (image !== undefined) {
        return <Image image={image} removeImage={this.removeImage} />;
      } else {
        return <Button onChange={this.onChange} />;
      }
    };

    return (
      <section>
        <form onSubmit={this.createQueu}>
          <input
            onChange={this.handleInput}
            type="text"
            name="event"
            placeholder="event"
          ></input>
          <input
            onChange={this.handleInput}
            type="text"
            name="email"
            placeholder="email"
          ></input>
          <input
            onChange={this.handleInput}
            type="text"
            name="password"
            placeholder="password"
          ></input>

          <div className="buttons">{content()}</div>
          <input
            onChange={this.handleInput}
            type="number"
            name="maxTeamSize"
            placeholder="max team size"
          ></input>
          <button type="submit">Create my Queu</button>
        </form>
      </section>
    );
  }
}

let propList = () => {
  return {};
};

let CAQ = connect(propList)(withRouter(caq));

export default CAQ;
