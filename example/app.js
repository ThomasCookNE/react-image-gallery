import React from 'react';
import ReactDOM from 'react-dom';

import Gallery from '../src/Gallery';
import images from './images';

import './client.scss'

class App extends React.Component {

  constructor() {
    super()
    this.state = {
      open: false,
    }
  }

  render() {
    const { open } = this.state;

    return (
      <div className="app">
        <div className="open-link" onClick={() => this.setState({ open: true })}>Open gallery</div>
        {open && <Gallery images={images} close={() => this.setState({ open: false})} heading={'Bild och film'} />}
      </div>
    )
  }
}

ReactDOM.render(<App/>, document.getElementById('container'))
