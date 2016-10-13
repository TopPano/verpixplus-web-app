'use strict';

import React, { Component, PropTypes } from 'react';

import EDITOR_CONTENT from 'content/editor/en-us.json';
import Modal from 'components/Common/Modal';

const CONTENT = EDITOR_CONTENT.PROCESS_MODAL;

if (process.env.BROWSER) {
  require('./ProcessModal.css');
}

const propTypes = {
  isProcessing: PropTypes.bool.isRequired
};

const defaultProps = {
};

class ProcessModal extends Component {
  constructor(props) {
    super(props);
  }

  componentDidUpdate(prevProps) {
    const { isProcessing } = this.props;

    if (!prevProps.isProcessing && isProcessing) {
      this.refs.modal.open();
    } else if (prevProps.isProcessing && !isProcessing) {
      this.refs.modal.close();
    }
  }

  render() {
    const { isProcessing } = this.props;
    const modalProps = {
      ref: 'modal',
      title: CONTENT.TITLE,
      closeBtn: {
        show: false
      },
      confirmBtn: {
        show: false
      },
      isProcessing
    };

    return (
      <Modal {...modalProps}>
        <div>{CONTENT.DESC}</div>
      </Modal>
    );
  }
}

ProcessModal.propTypes = propTypes;
ProcessModal.defaultProps = defaultProps;

export default ProcessModal;
