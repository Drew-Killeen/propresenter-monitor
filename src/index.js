import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
const axios = require("axios");

let ip = "localhost";
let port = "1025";

const fetchData = () => {
  return axios
    .get("http://" + ip + ":" + port + "/v1" + "/timers/current")
    .then((response) => response.data);
};

class PageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      configured: false,
    };
  }

  setTimerState = () => {
    this.setState({ configured: true });
  };

  render() {
    return (
      <>
        <ConfigFields onConfigSuccess={this.setTimerState} />
        {this.state.configured ? <TimerContainer /> : ""}
      </>
    );
  }
}

class ConfigFields extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ip: ip,
      port: port,
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
    this.props.onConfigSuccess();
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
    return (
      <div>
        {this.props.name} - {this.props.time}
      </div>
    );
  }
}

class TimerContainer extends React.Component {
  state = {
    timers: [],
  };

  componentDidMount() {
    this.timerID = setInterval(() => this.tick(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    fetchData().then((response) => {
      this.setState({
        timers: response,
      });
    });
  }

  render() {
    return (
      <ul>
        {this.state.timers.map((timer) => {
          return (
            <li key={timer.id.index}>
              <Countdown name={timer.id.name} time={timer.time} />
            </li>
          );
        })}
      </ul>
    );
  }
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<PageContainer />);
