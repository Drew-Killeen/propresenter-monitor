import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
const axios = require("axios");

let thumbnailQuality = 400;
let ip = "localhost";
let port = "1025";

const fetchTimerData = () => {
  return axios
    .get("http://" + ip + ":" + port + "/v1/timers/current")
    .then((response) => {
      return response;
    });
};

const fetchCurrentSlideIndex = () => {
  return axios
    .get("http://" + ip + ":" + port + "/v1/presentation/slide_index")
    .then((response) => {
      return response;
    });
};

const fetchSlideThumbnail = (id, index) => {
  return axios
    .get(
      "http://" +
        ip +
        ":" +
        port +
        "/v1/presentation/" +
        id +
        "/thumbnail/" +
        index +
        "?quality=" +
        thumbnailQuality
    )
    .then((response) => {
      return response;
    });
};

class PageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      configured: false,
    };
  }

  setTimerState = () => {
    fetchTimerData()
      .then((response) => {
        if (response.status == 200) {
          this.setState({ configured: true });
        } else {
          console.log("Error: " + response.status);
        }
      })
      .catch((response) => {
        console.log(response);
      });
  };

  render() {
    return (
      <>
        {this.state.configured ? (
          <>
            <TimerContainer />
            <SlidesContainer />
          </>
        ) : (
          <ConfigFields onConfigSuccess={this.setTimerState} />
        )}
      </>
    );
  }
}

class StatusOfConnection extends React.Component {
  render() {
    return <div className={this.props.status}>{this.props.status}</div>;
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

class Timer extends React.Component {
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
    fetchTimerData().then((response) => {
      this.setState({
        timers: response.data,
      });
    });
  }

  render() {
    return (
      <ul>
        {this.state.timers.map((timer) => {
          return (
            <li key={timer.id.index}>
              <Timer name={timer.id.name} time={timer.time} />
            </li>
          );
        })}
      </ul>
    );
  }
}

class Slide extends React.Component {
  render() {
    return <div>Slide</div>;
  }
}

class SlidesContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      presentationID: "1",
      presentationName: "",
      slideIndex: 0,
      slideCount: 0,
      slidesData: [],
      slidesStringArray: [],
      slidesImgArray: [],
    };

    this.handlePresentationUpdate = this.handlePresentationUpdate.bind(this);
  }

  componentDidMount() {
    this.handlePresentationUpdate();
  }

  handlePresentationUpdate() {
    fetchCurrentSlideIndex().then((response) => {
      console.log("handling presentation update");
      this.setState({
        presentationID: response.data.presentation_index.presentation_id.uuid,
        presentationName: response.data.presentation_index.presentation_id.name,
        slideIndex: response.data.presentation_index.index,
      });

      this.buildSlideArray(
        response.data.presentation_index.presentation_id.uuid,
        0
      );
    });
  }

  buildSlideArray(id, index) {
    fetchSlideThumbnail(id, index)
      .then((response) => {
        this.buildSlideArray(id, index + 1);
      })
      .catch(() => {
        this.setState({
          slideCount: index,
        });
      });
  }

  render() {
    return (
      <>
        <form onClick={this.handlePresentationUpdate}>
          <input type="button" value="Refresh" />
        </form>
        <div>{this.state.presentationName}</div>
        <div>
          {this.state.slideIndex} / {this.state.slideCount}
        </div>
        <Slide />
      </>
    );
  }
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<PageContainer />);
