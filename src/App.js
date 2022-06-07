import React, { Component } from "react";
import "./App.css";
import Clarifai from "clarifai";
import SignIn from "./components/signin/SignIn";
import Register from "./components/register/Register";
import Navigation from "./components/navigation/Navigation.js";
import Logo from "./components/logo/Logo.js";
import ImageLinkForm from "./components/imagelinkform/ImageLinkForm.js";
import Rank from "./components/rank/Rank.js";
import FaceRecognition from "./components/facerecognition/FaceRecognition.js";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

const app = new Clarifai.App({
  apiKey: "c2db2efb821940989b7f1f4f490c8830",
});

const particlesOptions = {
  fpsLimit: 120,
  interactivity: {
    events: {
      onClick: {
        enable: true,
        mode: "push",
      },
      onHover: {
        enable: true,
        mode: "repulse",
      },
      resize: true,
    },
    modes: {
      push: {
        quantity: 4,
      },
      repulse: {
        distance: 200,
        duration: 0.4,
      },
    },
  },
  particles: {
    color: {
      value: "#ffffff",
    },
    links: {
      color: "#ffffff",
      distance: 150,
      enable: true,
      opacity: 0.5,
      width: 1,
    },
    collisions: {
      enable: true,
    },
    move: {
      direction: "none",
      enable: true,
      outModes: {
        default: "bounce",
      },
      random: false,
      speed: 2,
      straight: false,
    },
    number: {
      density: {
        enable: true,
        area: 800,
      },
      value: 80,
    },
    opacity: {
      value: 0.5,
    },
    shape: {
      type: "circle",
    },
    size: {
      value: { min: 1, max: 5 },
    },
  },
  detectRetina: true,
};

const particlesInit = async (main) => {
  // you can initialize the tsParticles instance (main) here, adding custom shapes or presets
  // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
  // starting from v2 you can add only the features you need reducing the bundle size
  await loadFull(main);
};

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: "",
      imageUrl: "",
      box: {},
      route: "signin",
      isSignedIn: false
    };
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace =
      data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById("input-image");
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - clarifaiFace.right_col * width,
      bottomRow: height - clarifaiFace.bottom_row * height,
    };
  };

  displayFaceBox = (box) => {
    this.setState({ box: box });
  };

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  };

  onButtonSubmit = () => {
    this.setState({ imageUrl: this.state.input });
    app.models
      .predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
      .then((response) =>
        this.displayFaceBox(this.calculateFaceLocation(response))
      )
      .catch((err) => console.log(err));
  };

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState({isSignedIn: false })
    } else if (route === 'home') {
      this.setState({isSignedIn: true })
    }
    this.setState({route: route})
  }

  render() {
    const { imageUrl, box, route, isSignedIn } = this.state
    return (
      <div className="App">
        <Particles
          className="particles"
          id="tsparticles"
          init={particlesInit}
          options={particlesOptions}
        />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />

        {route === "home" ? (
          <div>
          <Logo />
          <Rank />
          <ImageLinkForm
            onInputChange={this.onInputChange}
            onButtonSubmit={this.onButtonSubmit}
          />
          <FaceRecognition
            box={box}
            imageUrl={imageUrl}
          />
        </div>
        ) : (
          route === 'signin' ? 
          <SignIn onRouteChange={this.onRouteChange} /> :
          <Register onRouteChange={this.onRouteChange} />
        )}
      </div>
    );
  }
}

export default App;
