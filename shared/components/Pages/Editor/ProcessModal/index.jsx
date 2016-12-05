'use strict';

import React, { Component, PropTypes } from 'react';

import Modal from 'components/Common/Modal';

if (process.env.BROWSER) {
  require('./ProcessModal.css');
}

const propTypes = {
  isProcessing: PropTypes.bool.isRequired
};

const defaultProps = {
};

class ProcessModal extends Component {
  static contextTypes = { i18n: PropTypes.object };

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
    const { l } = this.context.i18n;
    const { isProcessing } = this.props;
    const modalProps = {
      ref: 'modal',
      title: l('Processing'),
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
        <div>{l('Please wait, tasks will be completed soon')}</div>
      </Modal>
    );
  }
}

ProcessModal.propTypes = propTypes;
ProcessModal.defaultProps = defaultProps;

export default ProcessModal;
