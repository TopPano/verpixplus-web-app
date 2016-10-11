'use strict';

import React, { Component, PropTypes } from 'react';
import NotificationSystem from 'react-notification-system';

import CONTENT from 'content/notifications/en-us.json';

if (process.env.BROWSER) {
  require('./Notifications.css');
}

const propTypes = {
  notifications: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  popNotification: PropTypes.func.isRequired
};

const defaultProps = {
};

class Notifications extends Component {
  constructor(props) {
    super(props);

    // Bind "this" to member function
    this.handleRemoveNotification = this.handleRemoveNotification.bind(this);
  }

  // Map computer-readable notification to human-readable message
  mapNotificationToMessage(notification) {
    return CONTENT[notification] ? CONTENT[notification] : '';
  }

  // Add a new notification tonotification system
  addNotification(message, onRemove) {
    this.refs.notificationSystem.addNotification({
      message,
      level: 'info',
      position: 'bl', // Bottom left
      onRemove
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.notifications.length < this.props.notifications.length) {
      // A new notifications is pushed
      const message = this.mapNotificationToMessage(this.props.notifications[0]);
      this.addNotification(message, this.handleRemoveNotification);
    }
  }

  // Handler for a notification is removed
  handleRemoveNotification() {
    this.props.popNotification();
  }

  render() {
    return (
      <div className="notifications-component">
        <NotificationSystem ref="notificationSystem" />
      </div>
    );
  }
}

Notifications.propTypes = propTypes;
Notifications.defaultProps = defaultProps;

export default Notifications;
