'use strict';

import React, { Component, PropTypes } from 'react';

import Slider from 'components/Common/Slider';

if (process.env.BROWSER) {
  require('./Adjust.css');
}

const propTypes = {
  title: PropTypes.string.isRequired,
  initialValue: PropTypes.number,
  min: PropTypes.number,
  max: PropTypes.number
};

const defaultProps = {
  initialValue: 0,
  min: 0,
  max: 100
};

class Adjust extends Component {
  constructor(props) {
    super(props);

    // Bind "this" to memeber functions
    this.handleChange = this.handleChange.bind(this);
    // Initialize values
    this.state = {
      value: this.props.initialValue
    };
  }

  // Handler for value change
  handleChange(value) {
    this.setState({
      value
    });
  }

  render() {
    const { title, min, max } = this.props;
    const { value } = this.state;

    return (
      <div className="adjust-component heading margin-bottom-10">
        <h5><strong>{`${title} (${value})`}</strong></h5>
        <Slider
          min={min}
          max={max}
          value={value}
          onChange={this.handleChange}
        />
      </div>
    );
  }
}

Adjust.propTypes = propTypes;
Adjust.defaultProps = defaultProps;

export default Adjust;
