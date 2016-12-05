'use strict';

import React, { Component, PropTypes } from 'react';

const propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  isDisabled: PropTypes.bool,
  isFocused: PropTypes.bool,
  isSelected: PropTypes.bool,
  onFocus: PropTypes.func,
  onSelect: PropTypes.func,
  option: PropTypes.object.isRequired
};

const defaultProps = {
};

class IconSelectControl extends Component {
  constructor(props) {
    super(props);

    // Bind "this" to member functions
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
  }

  handleMouseDown (e) {
    e.preventDefault();
    e.stopPropagation();
    this.props.onSelect(this.props.option, e);
  }

  handleMouseEnter (e) {
    this.props.onFocus(this.props.option, e);
  }

  handleMouseMove (e) {
    if (this.props.isFocused) {
      return;
    }
    this.props.onFocus(this.props.option, e);
  }

  render() {
    const {
      className,
      option,
      children
    } = this.props;

    return (
      <div
        className={className}
        title={option.title}
        onMouseDown={this.handleMouseDown}
        onMouseEnter={this.handleMouseEnter}
        onMouseMove={this.handleMouseMove}
      >
        {
          option.img &&
          <div style={{ display: 'inline' }}>
            <img
              src={option.img}
              alt={option.label}
              width="14"
              height="14"
            />
            &nbsp;&nbsp;
          </div>
        }
        {
          option.icon &&
          <div style={{ display: 'inline' }}>
            <i style={{ width: '10px'}} className={`fa fa-${option.icon}`} />&nbsp;&nbsp;
          </div>
        }
        {children}
      </div>
    );
  }
}

IconSelectControl.propTypes = propTypes;
IconSelectControl.defaultProps = defaultProps;

export default IconSelectControl;
