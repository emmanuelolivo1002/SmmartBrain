import React, {Component} from 'react';
import './App.css';

// Packages
import 'tachyons';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';

// Components
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';

// Options for particles.js
const ParticleParams = {
  particles: {
    "number": {
      "value": 80,
      "density": {
        "enable": true,
        "value_area": 1500
      }
    },
    "color": {
      "value": "#ffffff"
    },
    "shape": {
      "type": "circle",
      "stroke": {
        "width": 0,
        "color": "#000000"
      },
      "polygon": {
        "nb_sides": 5
      },
      "image": {
        "src": "img/github.svg",
        "width": 100,
        "height": 100
      }
    },
    "opacity": {
      "value": 0.5,
      "random": false,
      "anim": {
        "enable": false,
        "speed": 1,
        "opacity_min": 0.1,
        "sync": false
      }
    },
    "size": {
      "value": 3,
      "random": true,
      "anim": {
        "enable": false,
        "speed": 40,
        "size_min": 0.1,
        "sync": false
      }
    },
    "line_linked": {
      "enable": true,
      "distance": 150,
      "color": "#ffffff",
      "opacity": 0.4,
      "width": 1
    },
    "move": {
      "enable": true,
      "speed": 6,
      "direction": "none",
      "random": false,
      "straight": false,
      "out_mode": "out",
      "bounce": false,
      "attract": {
        "enable": false,
        "rotateX": 600,
        "rotateY": 1200
      }
    }
  }
}

// Clarifai API configuration
const app = new Clarifai.App({apiKey: 'a911ba983b324580987163ea2c293bd4'});

class App extends Component {

  constructor() {
    super();
    // Setup state object
    this.state = {
      input: '',
      imageURL: '',
      box: {}
    }
  }

  // Calculate with response where the bounding_box would be located
  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs["0"].data.regions["0"].region_info.bounding_box;

    // Grab image by id
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);

    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }

  }

  displayFaceBox = (box) => {
    this.setState({box: box});
  }

  // Check whenever there is an input on ImageLinkForm
  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  // When detect button is clicked
  onButtonSubmit = () => {
    this.setState({imageURL: this.state.input});

    app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input).then(response => this.displayFaceBox(this.calculateFaceLocation(response))).catch(err => console.log(err));
  }

  render() {
    return (<div className="App">
      <Particles className='particles' params={ParticleParams}/>
      <Navigation/>
      <Logo/>
      <Rank/>
      <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
      <FaceRecognition box={this.state.box} imageURL={this.state.imageURL}/>
    </div>);
  }
}

export default App;
