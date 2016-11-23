'use strict';

import React, { Component, PropTypes } from 'react';
import ReactModal from 'react-bootstrap/lib/Modal';
import merge from 'lodash/merge';

import FlatButton from 'components/Common/FlatButton';
import Loading from 'components/Common/Loading';

if (process.env.BROWSER) {
  require('./Modal.css');
}

const propTypes = {
  title: PropTypes.string,
  titleIcon: PropTypes.string,
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
  titleIcon: '',
  closeBtn: {
    className: 'modal-btn close-btn pull-left',
    show: true
  },
  confirmBtn: {
    className: 'modal-btn confirm-btn pull-right',
    show: true
  },
  rootClose: false,
  isProcessing: false
};

class Modal extends Component {
  static contextTypes = { i18n: PropTypes.object };

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
    const { l } = this.context.i18n;
    const { isOpened } = this.state;
    const {
      title,
      titleIcon,
      closeBtn,
      confirmBtn,
      rootClose,
      isProcessing,
      children
    } = this.props;
    const defaultCloseBtnText = l('Close');
    const defaultConfirmBtnText = l('Confirm');
    const defaultCloseBtnProps = merge({}, defaultProps.closeBtn, {
      text: defaultCloseBtnText
    });
    const defaultConfirmBtnProps = merge({}, defaultProps.confirmBtn, {
      text: defaultConfirmBtnText
    });
    const closeBtnProps = merge({}, defaultCloseBtnProps, closeBtn);
    const confirmBtnProps = merge({}, defaultConfirmBtnProps, confirmBtn);

    return(
      <ReactModal
        show={isOpened}
        onHide={this.close}
      >
        {
          title &&
          <ReactModal.Header closeButton={rootClose}>
            <ReactModal.Title>
              {
                titleIcon &&
                <img
                  className="modal-title-icon"
                  src={titleIcon}
                  alt="title icon"
                />
              }
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
