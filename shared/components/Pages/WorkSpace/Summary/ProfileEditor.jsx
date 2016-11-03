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

const TAB_IDX = {
  PROFILE: 0,
  PASSWORD: 1
};

const propTypes = {
  userId: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  autobiography: PropTypes.string.isRequired,
  isProcessing: PropTypes.object.isRequired,
  updateProfile: PropTypes.func.isRequired,
  editAutobiography: PropTypes.func.isRequired
};

const defaultProps = {
};

class ProfileEditor extends Component {
  constructor(props) {
    super(props);

    // Bind "this" to member functions
    this.openModal = this.openModal.bind(this);
    this.handleChangeAutobiography = this.handleChangeAutobiography.bind(this);
    this.handleClickConfirmBtn = this.handleClickConfirmBtn.bind(this);
  }

  // handle for clicking button
  openModal() {
    this.refs.modal.open();
  }

  // Handler for changing autobiography
  handleChangeAutobiography(e) {
    this.props.editAutobiography(e.target.value);
  }

  // Handler for clicking confirm button
  handleClickConfirmBtn() {
    const activeIdx = this.refs.content.getActiveIndex();

    if (activeIdx === TAB_IDX.PROFILE) {
      const {
        userId,
        autobiography,
        updateProfile
      } = this.props;

      updateProfile({
        userId,
        autobiography
      });
    } else if (activeIdx === TAB_IDX.PASSWORD) {
      // TODO: Handle changing password
    }
  }

  // Render content for editting profile
  renderProfileContent(username, email, autobiography) {
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
            value={autobiography}
            onChange={this.handleChangeAutobiography}
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
      email,
      autobiography,
      isProcessing
    } = this.props;
    const modalProps = {
      ref: 'modal',
      title: CONTENT.EDIT_PROFILE.TITLE,
      confirmBtn: {
        icon: 'floppy-o',
        className: 'btn btn-u pull-right rounded',
        text: CONTENT.EDIT_PROFILE.CONFIRM_BTN,
        onClick: this.handleClickConfirmBtn
      },
      isProcessing: isProcessing.updateProfile
    };
    const profileContent = this.renderProfileContent(username, email, autobiography);
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
          <MultiTabsContent
            ref="content"
            tabsContent={tabsContent}
          />
        </Modal>
      </div>
    );
  }
}

ProfileEditor.propTypes = propTypes;
ProfileEditor.defaultProps = defaultProps;

export default ProfileEditor;
