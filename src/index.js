import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
const axios = require("axios");

let ip = "";
let port = "";

const fetchData = () => {
  return axios
    .get("http://" + ip + ":" + port + "/v1" + "/timers?chunked=false")
    .then((response) => response.data);
};

class ConfigFields extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ip: "localhost",
      port: "1025",
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    ip = this.state.ip;
    port = this.state.port;
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          IP Address:
          <input
            name="ip"
            type="text"
            value={this.state.ip}
            onChange={this.handleChange}
          />
        </label>
        <label>
          Port:
          <input
            name="port"
            type="text"
            value={this.state.port}
            onChange={this.handleChange}
          />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

class Countdown extends React.Component {
  render() {
    return <div>Countdown</div>;
  }
}
class Elapsed extends React.Component {
  render() {
    return <div>Elapsed</div>;
  }
}
class CountDownToTime extends React.Component {
  render() {
    return <div>CountDownToTime</div>;
  }
}

class TimerContainer extends React.Component {
  state = {
    timers: [],
  };

  render() {
    return (
      <ul>
        {this.state.timers.map((timer) => {
          // let timerType;
          // if (timer.countdown) {
          //   console.log("countdown");
          //   timerType = timer.countdown.duration;
          // } else if (timer.count_down_to_time) {
          //   console.log("countdown to time");
          //   timerType = timer.count_down_to_time.time_of_day;
          // } else {
          //   console.log("elapsed");
          //   timerType = timer.elapsed.start_time;
          // }
          <li key={timer.id.index}>{timer.id.name}</li>;
        })}
      </ul>
    );
  }
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<ConfigFields />);
