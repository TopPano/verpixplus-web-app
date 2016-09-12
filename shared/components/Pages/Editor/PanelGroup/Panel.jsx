'use strict';

import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

if (process.env.BROWSER) {
  require('./Panel.css');
}

const propTypes = {
  initialIsCollapsed: PropTypes.bool
};

const defaultProps = {
  initialIsCollapsed: false
};

class Panel extends Component {
  constructor(props) {
    super(props);
    // Bind "this" to event handlers
    this.handleClickHeading = this.handleClickHeading.bind(this);
    // Set initial state
    this.state = {
      isCollapsed: this.props.initialIsCollapsed
    };
  }

  handleClickHeading() {
    this.setState({
      isCollapsed: !this.state.isCollapsed
    });
  }

  render() {
    const { isCollapsed } = this.state;
    const bodyWrapperClass = classNames({
      'panel-collapse': true,
      'collapse': true,
      'in': !isCollapsed
    });

    return (
      <div className="panel-component">
        <div
          className="panel-heading-v2 overflow-h"
          onClick={this.handleClickHeading}
        >
          <h4 className="panel-title heading-sm pull-left">
            <i className="fa fa-tasks" />
            {"kekrer"}
          </h4>
          <i className="fa fa-angle-down pull-right" />
        </div>
        <div className={bodyWrapperClass}>
          <div className="panel-body">
            <p>fsdfsdfsdf</p>
            <p>fsdfsdfsdf</p>
            <p>fsdfsdfsdf</p>
            <p>fsdfsdfsdf</p>
          </div>
        </div>
      </div>
    );
  }
}

Panel.propTypes = propTypes;
Panel.defaultProps = defaultProps;

export default Panel;
