'use strict';

import React, { Component, PropTypes } from 'react';
import ReactModal from 'react-bootstrap/lib/Modal';
import merge from 'lodash/merge';

import CONTENT from 'content/site/en-us.json';
import FlatButton from 'components/Common/FlatButton';
import Loading from 'components/Common/Loading';

if (process.env.BROWSER) {
  require('./Modal.css');
}

const propTypes = {
  title: PropTypes.string,
  closeBtn: PropTypes.shape({
    className: PropTypes.string,
    text: PropTypes.string,
    show: PropTypes.bool,
    onClick: PropTypes.func
  }),
  confirmBtn: PropTypes.shape({
    className: PropTypes.string,
    text: PropTypes.string,
    show: PropTypes.bool,
    onClick: PropTypes.func
  }),
  rootClose: PropTypes.bool,
  isProcessing: PropTypes.bool
};

const defaultProps = {
  title: '',
  closeBtn: {
    className: 'modal-btn close-btn pull-left',
    text: CONTENT.MODAL.DEFAULT_CLOSE_BTN,
    show: true
  },
  confirmBtn: {
    className: 'modal-btn confirm-btn pull-right',
    text: CONTENT.MODAL.DEFAULT_CONFIRM_BTN,
    show: true
  },
  rootClose: false,
  isProcessing: false
};

class Modal extends Component {
  constructor(props) {
    super(props);

    // Bind "this" to member functions
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);

    // Initialize state
    this.state = {
      isOpened: false
    };
  }

  // Open the modal
  open() {
    this.setState({
      isOpened: true
    });
  }

  // Close the modal
  close() {
    if (!this.props.isProcessing) {
      this.setState({
        isOpened: false
      });
    }
  }

  render() {
    const { isOpened } = this.state;
    const {
      title,
      closeBtn,
      confirmBtn,
      rootClose,
      isProcessing,
      children
    } = this.props;
    const closeBtnProps = merge({}, defaultProps.closeBtn, closeBtn);
    const confirmBtnProps = merge({}, defaultProps.confirmBtn, confirmBtn);

    return(
      <ReactModal
        show={isOpened}
        onHide={this.close}
      >
        {
          title &&
          <ReactModal.Header closeButton={rootClose}>
            <ReactModal.Title>
              {`${title}  `}
              {
                isProcessing &&
                <Loading size={20} />
              }
            </ReactModal.Title>
          </ReactModal.Header>
        }
        <ReactModal.Body>
          {children}
        </ReactModal.Body>
        <ReactModal.Footer>
          {
            closeBtnProps.show &&
            <FlatButton
              {...closeBtnProps}
              disabled={isProcessing}
              onClick={closeBtnProps.onClick ? closeBtnProps.onClick : this.close}
            />
          }
          {
            confirmBtnProps.show &&
            <FlatButton
              {...confirmBtnProps}
              disabled={isProcessing}
              onClick={confirmBtnProps.onClick ? confirmBtnProps.onClick : this.close}
            />
          }
        </ReactModal.Footer>
      </ReactModal>
    );
  }
}

Modal.propTypes = propTypes;
Modal.defaultProps = defaultProps;

export default Modal;
