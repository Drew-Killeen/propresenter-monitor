import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
const axios = require("axios");

const url =
  "http://" + "localhost" + ":" + "1025" + "/v1" + "/timers?chunked=false";

class Timer extends React.Component {
  state = {
    timers: [],
  };

  componentDidMount() {
    console.log("running");
    axios.get(url).then((response) => {
      console.log(!response.data);
      const timers = response.data;
      this.setState({ timers });
    });
  }

  render() {
    return (
      <ul>
        {this.state.timers.map((timer) => {
          let timerType;
          if (timer.countdown) {
            console.log("countdown");
            timerType = timer.countdown.duration;
          } else if (timer.count_down_to_time) {
            console.log("countdown to time");
            timerType = timer.count_down_to_time.time_of_day;
          } else {
            console.log("elapsed");
            timerType = timer.elapsed.start_time;
          }
          <li key={timer.id.index}>
            {timer.id.name} - {timerType}
          </li>;
        })}
      </ul>
    );
  }
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Timer />);
