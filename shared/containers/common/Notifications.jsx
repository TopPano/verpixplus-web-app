'use strict';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import {
  popNotification
} from 'actions/notifications';

import Notifications from 'components/Common/Notifications';

const propTypes = {
  notifications: PropTypes.object.isRequired
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
  // which pops a notification.
  popNotification(id) {
    this.props.dispatch(popNotification(id));
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
