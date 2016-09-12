'use strict';

import React, { Component, PropTypes } from 'react';
import ReactSlider from 'rc-slider';
import classNames from 'classnames';

if (process.env.BROWSER) {
  require('rc-slider/assets/index.css');
  require('./Slider.css');
}

const propTypes = {
  sliderClass: PropTypes.string
};

const defaultProps = {
  sliderClass: ''
};

class Slider extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const otherClass = this.props.sliderClass;
    const sliderClass = classNames('slider-component', otherClass);

    return (
      <ReactSlider
        className={sliderClass}
        {...this.props}
      />
    );
  }
}

Slider.propTypes = propTypes;
Slider.defaultProps = defaultProps;

export default Slider;
