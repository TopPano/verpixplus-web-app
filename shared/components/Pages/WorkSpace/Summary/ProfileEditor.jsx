'use strict';

import React, { Component, PropTypes } from 'react';

import CONTENT from 'content/workspace/en-us.json';
import IconButton from 'components/Common/IconButton';
import MultiTabsContent from 'components/Common/MultiTabsContent';
import Modal from 'components/Common/Modal';
import RegBlockInput from 'components/Common/RegBlock/RegBlockInput';

if (process.env.BROWSER) {
  require('./ProfileEditor.css');
}

const propTypes = {
  username: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired
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

  // Render content for editting profile
  renderProfileContent(username, email) {
    return (
      <dl className="profile-content dl-horizontal">
        <dt><strong>{CONTENT.EDIT_PROFILE.USERNAME}</strong></dt>
        <dd>{username}</dd>
        <hr />
        <dt><strong>{CONTENT.EDIT_PROFILE.EMAIL}</strong></dt>
        <dd>{email}</dd>
        <hr />
        <dt><strong>{CONTENT.EDIT_PROFILE.AUTOBIOGRAPHY}</strong></dt>
        <dd>
          <textarea
            className="form-control"
            rows="6"
          />
        </dd>
      </dl>
    );
  }

  // Render content for changing password
  renderPasswordContent() {
    return (
      <dl className="password-content dl-horizontal">
        <RegBlockInput
          icon="lock"
          type="password"
          placeHolder={CONTENT.EDIT_PROFILE.PWD}
        />
        <RegBlockInput
          icon="key"
          type="password"
          placeHolder={CONTENT.EDIT_PROFILE.CONFIRM_PWD}
        />
      </dl>
    );
  }

  render() {
    const {
      username,
      email
    } = this.props;
    const modalProps = {
      ref: 'modal',
      title: CONTENT.EDIT_PROFILE.TITLE,
      confirmBtn: {
        icon: 'floppy-o',
        className: 'btn btn-u pull-right rounded',
        text: CONTENT.EDIT_PROFILE.CONFIRM_BTN
      }
    };
    const profileContent = this.renderProfileContent(username, email);
    const passwordContent = this.renderPasswordContent();
    const tabsContent = [{
      tab: CONTENT.EDIT_PROFILE.CONTENT.PROFILE,
      content: profileContent
    }, {
      tab: CONTENT.EDIT_PROFILE.CONTENT.PASSWORD,
      content: passwordContent
    }];

    return (
      <div className="profile-editor-component">
        <IconButton
          className="profile-editor-component btn btn-u rounded"
          icon="pencil"
          text={CONTENT.EDIT_PROFILE.TITLE}
          handleClick={this.openModal}
        />
        <Modal {...modalProps}>
          <MultiTabsContent tabsContent={tabsContent} />
        </Modal>
      </div>
    );
  }
}

ProfileEditor.propTypes = propTypes;
ProfileEditor.defaultProps = defaultProps;

export default ProfileEditor;
