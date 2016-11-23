'use strict'

import React, { Component, PropTypes } from 'react';
import isString from 'lodash/isString';
import isEmpty from 'is-empty';

import ERR from 'constants/err';
import { VIDEO_DURATION_LIMIT } from 'constants/editor';
import Modal from 'components/Common/Modal';
import { sprintf } from 'lib/utils';

if (process.env.BROWSER) {
  require('./ErrorModal.css');
}

const propTypes = {
  err: PropTypes.shape({
    message: PropTypes.string.isRequired
  }).isRequired,
  clearErr: PropTypes.func.isRequired,
  onExit: PropTypes.func
};

const defaultProps = {
  onExit: () => {}
};

class ErrorModal extends Component {
  static contextTypes = { i18n: PropTypes.object };

  constructor(props) {
    super(props);

    // Bind "this" to member functions
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
  }

  // Open the modal
  open() {
    this.refs.modal.open();
  }

  // Close the modal
  close() {
    const {
      clearErr,
      onExit
    } = this.props;

    this.refs.modal.close();
    clearErr();
    onExit();
  }

  // Get human-readable message from err
  getReadableMessage(err) {
    const { l, nl } = this.context.i18n;
    const { message } = err;

    if (!isString(message) || isEmpty(message)) {
      return l(ERR.DEFAULT);
    }

    const readableMessage = l(message);

    switch (message) {
      case ERR.MEDIA_NOT_SUPPORTED:
        return `${readableMessage}: ${err.mediaType}`;
      case ERR.EXCEED_VIDEO_TIME_LIMIT:
        return `${readableMessage} (${sprintf(nl('%d second', '%d seconds', VIDEO_DURATION_LIMIT), VIDEO_DURATION_LIMIT)})`;
      default:
        return readableMessage;
    }
  }

  componentWillReceiveProps(nextProps) {
    const prevMessage = this.props.err.message;
    const nextMessage = nextProps.err.message;

    if (prevMessage !== nextMessage) {
      if (prevMessage === '' && nextMessage !== '') {
        this.open();
      }
    }
  }

  render() {
    const { l } = this.context.i18n;
    const readableMessage = this.getReadableMessage(this.props.err);
    const modalProps = {
      ref: 'modal',
      title: l('Error'),
      titleIcon: '/static/images/error.svg',
      closeBtn: {
        onClick: this.close
      },
      confirmBtn: {
        show: false
      }
    };

    return (
      <div className="error-modal-component" onClick={this.open}>
        <Modal {...modalProps} >
          <div>{readableMessage}</div>
        </Modal>
      </div>
    );
  }
}

ErrorModal.propTypes = propTypes;
ErrorModal.defaultProps = defaultProps;

export default ErrorModal;
