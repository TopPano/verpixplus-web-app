'use strict';

import React, { Component, PropTypes } from 'react';

import Slider from 'components/Common/Slider';

if (process.env.BROWSER) {
  require('./Adjust.css');
}

const propTypes = {
  type: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  initialValue: PropTypes.number.isRequired,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  step: PropTypes.number,
  adjustFilters: PropTypes.func.isRequired
};

const defaultProps = {
  step: 0.01
};

class Adjust extends Component {
  constructor(props) {
    super(props);

    // Bind "this" to member functions
    this.handleChange = this.handleChange.bind(this);
    this.handleAfterChange = this.handleAfterChange.bind(this);

    // Initialize state
    this.state = {
      value: props.initialValue,
      shownValue: props.initialValue
    };
  }

  // Handler for changin adjustment value
  handleChange(value) {
    this.setState({
      value
    });
  }

  // Handler for ater changing adjustment value
  handleAfterChange(value) {
    const {
      type,
      adjustFilters
    } = this.props;

    this.setState({
      shownValue: value
    });

    adjustFilters({
      adjusts: {
        [type]: value
      }
    });
  }

  render() {
    const {
      value,
      shownValue
    } = this.state;
    const {
      title,
      min,
      max,
      step
    } = this.props;

    return (
      <div className="adjust-component margin-bottom-15">
        <div className="adjust-text overflow-h">
          <p className="pull-left">{title}</p>
          <p className="adjust-value rounded pull-right">{shownValue}</p>
        </div>
        <Slider
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={this.handleChange}
          onAfterChange={this.handleAfterChange}
        />
      </div>
    );
  }
}

Adjust.propTypes = propTypes;
Adjust.defaultProps = defaultProps;

export default Adjust;
