'use strict';

import React, { Component, PropTypes } from 'react';

import Slider from 'components/Common/Slider';
import FrameTrimmerHandle from './FrameTrimmerHandle';

if (process.env.BROWSER) {
  require('./FrameTrimmer.css');
}

const propTypes = {
  min: PropTypes.number,
  max: PropTypes.number,
  value: PropTypes.arrayOf(PropTypes.number),
  onChange: PropTypes.func
};

const defaultProps = {
  min: 1,
  max: 1,
  value: [ 1, 1 ],
  onChange: () => {}
};

class FrameTrimmer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { min, max, value, onChange } = this.props;
    const sliderProps = {
      range: true,
      allowCross: false,
      sliderClass: 'frame-slider',
      handle: <FrameTrimmerHandle />,
      min,
      max,
      value,
      onChange
    };

    return (
      <div className="frame-trimmer-component">
        <Slider {...sliderProps} />
      </div>
    );
  }
}

FrameTrimmer.propTypes = propTypes;
FrameTrimmer.defaultProps = defaultProps;

export default FrameTrimmer;
