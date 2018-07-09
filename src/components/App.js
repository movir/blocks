import React, { Component } from 'react';

import Plate from './Plate';
import logo from '../assets/logo.svg';
import '../assets/App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>

        <Plate />

      </div>
    );
  }
}

export default App;
