'use strict';

import React, { Component, PropTypes } from 'react';
import Collapse from 'react-bootstrap/lib/Collapse';
import classNames from 'classnames';

if (process.env.BROWSER) {
  require('./EditItem.css');
}

const propTypes = {
  icon: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired
};

const defaultProps = {
};

class EditItem extends Component {
  constructor(props) {
    super(props);

    // Bind "this" to member functions
    this.HandleClickHeading = this.HandleClickHeading.bind(this);
    // Initialize state
    this.state = {
      active: true
    }
  }

  // Handler for clicking heading
  HandleClickHeading() {
    this.setState({
      active: !this.state.active
    });
  }

  render() {
    const { icon, title, children } = this.props;
    const { active } = this.state;
    const arrowClass = classNames({
      'fa': true,
      'pull-right': true,
      'fa-arrow-circle-up': active,
      'fa-arrow-circle-down': !active
    });

    return (
      <div className="edit-item-component">
        <div
          className="panel-heading overflow-h clickable"
          onClick={this.HandleClickHeading}
        >
          <h3 className="panel-title heading-sm pull-left">
            <i className={`fa fa-${icon}`} />
            <strong>{title}</strong>
          </h3>
          <i className={arrowClass} />
        </div>
        <Collapse in={active}>
          <div className="content-wrapper">
            {children}
          </div>
        </Collapse>
      </div>
    );
  }
}

EditItem.propTypes = propTypes;
EditItem.defaultProps = defaultProps;

export default EditItem;
