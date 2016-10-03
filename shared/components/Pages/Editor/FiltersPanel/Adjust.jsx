'use strict';

import React, { Component, PropTypes } from 'react';

import Slider from 'components/Common/Slider';

if (process.env.BROWSER) {
  require('./Adjust.css');
}

const propTypes = {
  type: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  unit: PropTypes.string,
  applyFilters: PropTypes.func.isRequired
};

const defaultProps = {
  unit: '%'
};

class Adjust extends Component {
  constructor(props) {
    super(props);

    // Bind "this" to member functions
    this.handleChange = this.handleChange.bind(this);
  }

  // Handler for change adjustment value
  handleChange(value) {
    const {
      type,
      applyFilters
    } = this.props;

    applyFilters({
      [type]: value
    });
  }

  render() {
    const {
      title,
      value,
      min,
      max,
      unit
    } = this.props;

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
