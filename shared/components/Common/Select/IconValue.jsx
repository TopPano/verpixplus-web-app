'use strict';

import React, { Component, PropTypes } from 'react';

const propTypes = {
  children: PropTypes.node,
  placeholder: PropTypes.string,
  value: PropTypes.object
};

const defaultProps = {
};

class IconValue extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      value,
      children
    } = this.props;

    return (
      <div
        className="Select-value"
        title={this.props.value.title}
      >
        <span className="Select-value-label">
          {
            value.img &&
            <div style={{ display: 'inline' }}>
              <img
                src={value.img}
                alt={value.label}
                width="14"
                height="14"
              />
              &nbsp;&nbsp;
            </div>
          }
          {
            value.icon &&
            <div style={{ display: 'inline' }}>
              <i style={{ width: '10px'}} className={`fa fa-${value.icon}`} />&nbsp;&nbsp;
            </div>
          }
          {children}
        </span>
      </div>
    );
  }
}

IconValue.propTypes = propTypes;
IconValue.defaultProps = defaultProps;

export default IconValue;
