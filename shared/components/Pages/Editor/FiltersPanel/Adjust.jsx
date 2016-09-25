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
  max: PropTypes.number,
  unit: PropTypes.string
};

const defaultProps = {
  initialValue: 0,
  min: 0,
  max: 100,
  unit: '%'
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
    const {
      title,
      min,
      max,
      unit
    } = this.props;
    const { value } = this.state;

    return (
      <div className="adjust-component margin-bottom-5">
        <div className="panel-heading overflow-h">
          <h5 className="panel-tile heading-sm pull-left">{title}</h5>
          <h5 className="adjust-value rounded pull-right">{`${value} ${unit}`}</h5>
        </div>
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
