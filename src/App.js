import React, { Component } from 'react';
import './App.css';
import './index.css';
import Gallery from './components/Gallery';

class App extends Component {
  render() {
    return (
      <div className="App">
        <h1>Sortable Image Gallery</h1>
        <Gallery imgCount="10" />
      </div>
    );
  }
}

export default App;
