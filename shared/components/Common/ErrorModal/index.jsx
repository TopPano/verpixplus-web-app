'use strict'

import React, { Component, PropTypes } from 'react';

import ERR from 'constants/err';
import { VIDEO_DURATION_LIMIT } from 'constants/editor';
import COMMON_CONTENT from 'content/common/en-us.json';
import ERROR_CONTENT from 'content/err/en-us.json';
import Modal from 'components/Common/Modal';

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

  // Convert err to human-readable message
  getReadableMessage(err) {
    const { message } = err;
    const readableMessage = ERROR_CONTENT[message];

    switch (message) {
      case ERR.MEDIA_NOT_SUPPORTED:
        return `${readableMessage}: ${err.mediaType}`;
      case ERR.EXCEED_VIDEO_TIME_LIMIT:
        return `${readableMessage} (${VIDEO_DURATION_LIMIT} ${ERROR_CONTENT.SECONDS})`;
      default:
        return (
          readableMessage ? readableMessage :
          message ? message : ERROR_CONTENT.DEFAULT
        );
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
    const readableMessage = this.getReadableMessage(this.props.err);
    const modalProps = {
      ref: 'modal',
      title: COMMON_CONTENT.ERROR_MODAL.TITLE,
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
