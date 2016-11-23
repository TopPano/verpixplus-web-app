'use strict';

import React, { Component, PropTypes } from 'react';
import NotificationSystem from 'react-notification-system';
import indexOf from 'lodash/indexOf';
import findIndex from 'lodash/findIndex';
import isString from 'lodash/isString';
import isEmpty from 'is-empty';

import { NOTIFICATION_TYPES } from 'constants/notifications';

if (process.env.BROWSER) {
  require('./Notifications.css');
}

const propTypes = {
  notifications: PropTypes.object.isRequired,
  popNotification: PropTypes.func.isRequired
};

const defaultProps = {
};

class Notifications extends Component {
  static contextTypes = { i18n: PropTypes.object };

  constructor(props) {
    super(props);
  }

  // Get active notifications from NotificationSystem
  getSystemNotifications() {
    return this.refs.notificationSystem.state.notifications || [];
  }

  // Find the index of a notification from NotificationSystem
  findIndexOfSystemNotification(id) {
    const systemNotifications = this.getSystemNotifications();
    return findIndex(systemNotifications, (notification) => notification.uid === id);
  }

  // Get human-readable message
  getReadableMessage(message) {
    const { l } = this.context.i18n;

    if (!isString(message) || isEmpty(message)) {
      return '';
    }

    return l(message);
  }

  // Get message of progress notification
  getProgressMessage(progress) {
    const { l } = this.context.i18n;
    const percent = parseInt(progress * 100, 10);

    return `${l('Share to')} Facebook ... ${percent}% ${l('Complete')}`;
  }

  // Add a new notification to notification system
  addNotification(notification, id, onRemove) {
    const { type } = notification;

    if (type === NOTIFICATION_TYPES.INFO) {
      const { message } = notification;
      const readableMessage = this.getReadableMessage(message);

      this.refs.notificationSystem.addNotification({
        message: readableMessage,
        level: 'info',
        position: 'bl', // Bottom left
        onRemove,
        uid: id
      });
    } else if (type === NOTIFICATION_TYPES.PROGRESS){
      const {
        title,
        progress
      } = notification;

      this.refs.notificationSystem.addNotification({
        title,
        message: this.getProgressMessage(progress),
        level: 'info',
        position: 'br', // Bottom right
        dismissible: false,
        autoDismiss: 0,
        onRemove,
        uid: id
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    const preNotifications = this.props.notifications;
    const nextNotifications = nextProps.notifications;

    if (preNotifications.ids.length < nextNotifications.ids.length) {
      const newId = nextNotifications.ids[0];
      const newNotification = nextNotifications.objs[newId];
      // A new notifications is pushed
      this.addNotification(newNotification, newId, () => {
        this.props.popNotification(newId);
      });
    } else if (preNotifications.ids.length === nextNotifications.ids.length) {
      // Check any progress is updated
      nextNotifications.ids.forEach((id) => {
        const nextNotification = nextNotifications.objs[id];
        if (nextNotification.type === NOTIFICATION_TYPES.PROGRESS) {
          const newProgress = nextNotification.progress;
          if (newProgress !== preNotifications.objs[id].progress) {
            const idx = this.findIndexOfSystemNotification(id);
            this.refs.notificationSystem.state.notifications[idx].message = this.getProgressMessage(newProgress);
            this.refs.notificationSystem.forceUpdate();
          }
        }
      });
    } else {
      // Remove old notification(s)
      this.getSystemNotifications().forEach((notification) => {
        if (indexOf(nextNotifications.ids, notification.uid) < 0) {
          this.refs.notificationSystem.removeNotification(notification.uid);
        }
      });
    }
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
