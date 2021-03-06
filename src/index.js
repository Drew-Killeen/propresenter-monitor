import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
const axios = require("axios");

// Sets the thumbnail size so that two thumbnails fit size by size, unless the size is greater than 300
let thumbnailQuality = Math.min(Math.ceil(window.innerWidth / 2.5), 300);
let ip = "";
let port = "";

const fetchVersion = () => {
  return axios
    .get("http://" + ip + ":" + port + "/version")
    .then((response) => {
      return response;
    });
};

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

const fetchSlideCount = (id, index) => {
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
    .then(() => {
      return;
    });
};

const fetchSlideThumbnail = (id, index) => {
  return (
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
  );
};

class PageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      configured: false,
      error: false,
    };
  }

  // Check version. Will return 200 in case of success.
  checkConnection = () => {
    fetchVersion()
      .then((response) => {
        if (response.status == 200) {
          this.setState({ configured: true, error: false });
        } else {
          console.log("Error: " + response.status);
        }
      })
      .catch((response) => {
        this.setState({ error: true });
        console.log(response);
      });
  };

  render() {
    return (
      <>
        <div className="page-title">ProPresenter Monitor</div>

        {this.state.configured ? (
          <>
            <TimerContainer />
            <SlidesContainer />
          </>
        ) : (
          <ConfigFields
            onConfigSuccess={this.checkConnection}
            error={this.state.error}
          />
        )}
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
      connectText: "Connect",
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
    this.setState({ connectText: "Connecting..." });
    ip = this.state.ip;
    port = this.state.port;
    this.props.onConfigSuccess();
  }

  render() {
    return (
      <div className="config-container">
        <form onSubmit={this.handleSubmit}>
          <div className="config-section">
            <label className="config-label">IP Address:</label>
            <input
              className="text-input"
              name="ip"
              type="text"
              value={this.state.ip}
              onChange={this.handleChange}
            />
          </div>

          <div className="config-section">
            <label className="config-label">Port:</label>
            <input
              className="text-input"
              name="port"
              type="text"
              value={this.state.port}
              onChange={this.handleChange}
            />
          </div>

          <div>
            <input
              className="submit-connect"
              type="submit"
              value={this.state.connectText}
            />
          </div>
        </form>
        {this.props.error ? (
          <div className="error">Error: cannot connect</div>
        ) : (
          ""
        )}
      </div>
    );
  }
}

class Timer extends React.Component {
  render() {
    return (
      <div className="timer-box">
        <div className="timer-label">
          {this.props.name}
          <div className="timer-time">{this.props.time}</div>
        </div>
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
      <div className="module timers-container">
        <div className="container-title timers-title">Timers</div>
        <ul>
          {this.state.timers.map((timer) => {
            return (
              <li key={timer.id.index} className="timer">
                <Timer name={timer.id.name} time={timer.time} />
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}

class Slide extends React.Component {
  render() {
    return (
      <div className={this.props.currentSlide + "slide-box"}>
        <img src={this.props.img} className="slide-thumbnail" />
        <div className="slide-number">{this.props.slideNumber}</div>
      </div>
    );
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
    };

    this.handlePresentationUpdate = this.handlePresentationUpdate.bind(this);
  }

  componentDidMount() {
    this.handlePresentationUpdate();
  }

  handlePresentationUpdate() {
    fetchCurrentSlideIndex().then((response) => {
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
    fetchSlideCount(id, index)
      .then(() => {
        this.buildSlideArray(id, index + 1);
      })
      .catch(() => {
        this.setState({
          slideCount: index,
        });
      });
  }

  increaseSlideSize = () => {
    if (thumbnailQuality < 500) {
      thumbnailQuality = thumbnailQuality + 50;
      this.buildSlideArray(this.state.presentationID, 0);
    }
  };

  decreaseSlideSize = () => {
    if (thumbnailQuality > 100) {
      thumbnailQuality = thumbnailQuality - 50;
      this.buildSlideArray(this.state.presentationID, 0);
    }
  };

  render() {
    let slideImgs = [];
    if (this.state.slideCount > 0) {
      for (let i = 0; i < this.state.slideCount; i++) {
        slideImgs.push(
          <Slide
            img={fetchSlideThumbnail(this.state.presentationID, i)}
            slideNumber={i + 1}
            currentSlide={this.state.slideIndex === i ? "current-slide " : ""}
          />
        );
      }
    }

    return (
      <>
        <div className="module">
          <div className="container-title">
            Presentation
            <div className="refresh-container">
              <form
                className="refresh-form"
                onClick={this.handlePresentationUpdate}
              >
                <input
                  className="refresh-button"
                  type="button"
                  value="Refresh"
                />
              </form>
            </div>
          </div>
          <div className="presentation-name presentation-box">
            {this.state.presentationName}
          </div>

          <div className="slide-count presentation-box">
            {this.state.slideIndex + 1} / {this.state.slideCount}
          </div>
        </div>

        <div className="module">
          <div className="container-title">
            Slides
            <div className="slides-size-buttons-container">
              <form
                className="slides-size-form"
                onClick={this.increaseSlideSize}
              >
                <input
                  className="slides-size-buttons"
                  type="button"
                  value="+"
                />
              </form>
              <form
                className="slides-size-form"
                onClick={this.decreaseSlideSize}
              >
                <input
                  className="slides-size-buttons"
                  type="button"
                  value="-"
                />
              </form>
            </div>
          </div>
          <div className="container-slides">{slideImgs}</div>
        </div>
      </>
    );
  }
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<PageContainer />);
