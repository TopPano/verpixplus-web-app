'use strict';

import React, { Component } from 'react';

import CONTENT from 'content/workspace/en-us.json';
import IconButton from 'components/Common/IconButton';
import Modal from 'components/Common/Modal';

if (process.env.BROWSER) {
  require('./ProfileEditor.css');
}

const propTypes = {
};

const defaultProps = {
};

class ProfileEditor extends Component {
  constructor(props) {
    super(props);

    // Bind "this" to member functions
    this.openModal = this.openModal.bind(this);
  }

  // handle for clicking button
  openModal() {
    this.refs.modal.open();
  }

  render() {
    const modalProps = {
      ref: 'modal',
      title: CONTENT.EDIT_PROFILE.TITLE,
      confirmBtn: {
        icon: 'floppy-o',
        className: 'btn btn-u pull-right rounded',
        text: CONTENT.EDIT_PROFILE.CONFIRM_BTN
      }
    };

    return (
      <div className="profile-editor-component">
        <IconButton
          className="profile-editor-component btn btn-u rounded"
          icon="pencil"
          text={CONTENT.EDIT_PROFILE.TITLE}
          handleClick={this.openModal}
        />
        <Modal {...modalProps}>
        </Modal>
      </div>
    );
  }
}

ProfileEditor.propTypes = propTypes;
ProfileEditor.defaultProps = defaultProps;

export default ProfileEditor;
