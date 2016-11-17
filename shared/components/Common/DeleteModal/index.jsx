'use strict'

import React, { Component, PropTypes } from 'react';

import COMMON_CONTENT from 'content/common/en-us.json';
import Modal from 'components/Common/Modal';

if (process.env.BROWSER) {
  require('./DeleteModal.css');
}

const CONTENT = COMMON_CONTENT.DELETE_MODAL;

const propTypes = {
  mediaId: PropTypes.string.isRequired,
  isProcessing: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
  deleteMedia: PropTypes.func.isRequired
};

const defaultProps = {
};

class DeleteModal extends Component {
  constructor(props) {
    super(props);

    // Bind "this" to member functions
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.handleClickDeleteBtn = this.handleClickDeleteBtn.bind(this);
  }

  // Open the modal
  open() {
    this.refs.modal.open();
  }

  // Close the modal
  close() {
    if (!this.props.isProcessing) {
      this.refs.modal.close();
    }
  }

  // Handler for clicking delete button
  handleClickDeleteBtn() {
    const {
      mediaId,
      deleteMedia
    } = this.props;

    deleteMedia({
      mediaId
    });
  }

  render() {
    const {
      isProcessing,
      children
    } = this.props;
    const modalProps = {
      ref: 'modal',
      title: CONTENT.TITLE,
      closeBtn: {
        text: CONTENT.CLOSE_BTN
      },
      confirmBtn: {
        className: 'modal-btn pull-right',
        text: CONTENT.CONFIRM_BTN,
        onClick: this.handleClickDeleteBtn
      },
      isProcessing
    };

    return (
      <div
        className="delte-model-component"
        onClick={this.open}
      >
        {children}
        <Modal {...modalProps} >
          <div>{CONTENT.DESC}</div>
        </Modal>
      </div>
    );
  }
}

DeleteModal.propTypes = propTypes;
DeleteModal.defaultProps = defaultProps;

export default DeleteModal;
