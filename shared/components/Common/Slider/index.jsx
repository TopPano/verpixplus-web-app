'use strict';

import React, { Component } from 'react';
import ReactSlider from 'rc-slider';

if (process.env.BROWSER) {
  require('rc-slider/assets/index.css');
  require('./Slider.css');
}

const propTypes = {
}

const defaultProps = {
}

class Slider extends Component{
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ReactSlider
        className="slider-component"
        {...this.props}
      />
    );
  }
}

Slider.propTypes = propTypes;
Slider.defaultProps = defaultProps;

export default Slider;
