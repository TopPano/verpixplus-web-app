'use strict';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import {
  popNotification
} from 'actions/notifications';

import Notifications from 'components/Common/Notifications';

const propTypes = {
  notifications: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired
};

const defaultProps = {
};

class NotificationsContainer extends Component {
  constructor(props) {
    super(props);

    // Bind "this" to member function
    this.popNotification = this.popNotification.bind(this);
  }

  // Wrapper for dispatching popNotification function,
  // which pops the oldest notification.
  popNotification() {
    this.props.dispatch(popNotification());
  }

  render() {
    return (
      <Notifications
        notifications={this.props.notifications}
        popNotification={this.popNotification}
      />
    );
  }
}

NotificationsContainer.propTypes = propTypes;
NotificationsContainer.defaultProps = defaultProps;

function mapStateToProps(state) {
  const { notifications } = state;
  return {
    notifications
  };
}

export default connect(mapStateToProps)(NotificationsContainer);
