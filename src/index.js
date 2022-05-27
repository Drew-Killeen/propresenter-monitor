import React, { Component } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
const axios = require("axios");

let ip = "localhost";
let port = "1025";
const timersUrl = "http://" + ip + ":" + port + "/v1" + "/timers?chunked=false";

const fetchTimerData = () => {
  console.log("running");
  axios.get(timersUrl).then((response) => {
    console.log(!response.data);
    const timers = response.data;
    this.setState({ timers });
  });
};

class Config extends Component {
  render() {
    return <div>Config</div>;
  }
}

class TimerContainer extends Component {
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
root.render(<Config />);
