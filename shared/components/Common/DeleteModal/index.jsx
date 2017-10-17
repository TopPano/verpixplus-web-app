'use strict'

import React, { Component, PropTypes } from 'react';

import Modal from 'components/Common/Modal';

if (process.env.BROWSER) {
  require('./DeleteModal.css');
}

const propTypes = {
  mediaId: PropTypes.string.isRequired,
  isProcessing: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
  deleteMedia: PropTypes.func.isRequired
};

const defaultProps = {
};

class DeleteModal extends Component {
  static contextTypes = { i18n: PropTypes.object };

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
    const { l } = this.context.i18n;
    const {
      isProcessing,
      children
    } = this.props;
    const modalProps = {
      ref: 'modal',
      title: l('Delete Media'),
      closeBtn: {
        text: l('Cancel')
      },
      confirmBtn: {
        className: 'delete-modal-confirm-btn modal-btn pull-right',
        text: l('Delete'),
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
          <div>{l('This media will be deleted and you won\'t be able to find it anymore')}</div>
        </Modal>
      </div>
    );
  }
}

DeleteModal.propTypes = propTypes;
DeleteModal.defaultProps = defaultProps;

export default DeleteModal;
