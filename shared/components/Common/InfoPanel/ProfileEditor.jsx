'use strict';

import React, { Component, PropTypes } from 'react';
import isEmpty from 'is-empty';

import CONTENT from 'content/workspace/en-us.json';
import FlatButton from 'components/Common/FlatButton';
import MultiTabsContent from 'components/Common/MultiTabsContent';
import Modal from 'components/Common/Modal';
import RegBlockInput from 'components/Common/RegBlock/RegBlockInput';
import RegBlockErr from 'components/Common/RegBlock/RegBlockErr';

const {
  EDIT_PROFILE,
  ERR_MSG
} = CONTENT;

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
  errMsgs: PropTypes.object.isRequired,
  updateProfile: PropTypes.func.isRequired,
  editAutobiography: PropTypes.func.isRequired,
  changePassword: PropTypes.func.isRequired,
  clearErrMsgChangePassword: PropTypes.func.isRequired
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

  // Update user profile
  updateProfile() {
    const {
      userId,
      autobiography,
      updateProfile
    } = this.props;

    updateProfile({
      userId,
      autobiography
    });
  }

  // Change user password
  changePassword() {
    this.refs.pwdErr.clear();

    const {
      userId,
      changePassword
    } = this.props;
    const oldPwd = this.refs.oldPwd;
    const newPwd = this.refs.newPwd;
    const confirmNewPwd = this.refs.confirmNewPwd;
    const oldPwdVal = oldPwd.getValue();
    const newPwdVal = newPwd.getValue();
    const confirmNewPwdVal = confirmNewPwd.getValue();

    // Check old password is empty or not
    if (isEmpty(oldPwdVal)) {
      oldPwd.err(ERR_MSG.OLD_PWD.EMPTY);
      return;
    }
    // Check new password is empty or not
    if (isEmpty(newPwdVal)) {
      newPwd.err(ERR_MSG.NEW_PWD.EMPTY);
      return;
    }
    // Check confirmed new password is empty or not
    if (isEmpty(confirmNewPwdVal)) {
      confirmNewPwd.err(ERR_MSG.CONFIRM_NEW_PWD.EMPTY);
      return;
    }
    // Check equality of new password and confirmed new password
    if (newPwdVal !== confirmNewPwdVal) {
      newPwd.err(ERR_MSG.NEW_PWD.NOT_MATCHED);
      return;
    }

    changePassword({
      userId,
      oldPassword: oldPwdVal,
      newPassword: newPwdVal
    })
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
      this.updateProfile();
    } else if (activeIdx === TAB_IDX.PASSWORD) {
      this.changePassword();
    }
  }

  // Render content for editting profile
  renderProfileContent(username, email, autobiography) {
    return (
      <dl className="profile-content dl-horizontal">
        <dt><strong>{EDIT_PROFILE.USERNAME}</strong></dt>
        <dd>{username}</dd>
        <hr />
        <dt><strong>{EDIT_PROFILE.EMAIL}</strong></dt>
        <dd>{email}</dd>
        <hr />
        <dt><strong>{EDIT_PROFILE.AUTOBIOGRAPHY}</strong></dt>
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
  renderPasswordContent(errMsg, clearErrMsg) {
    return (
      <dl className="password-content dl-horizontal">
        <RegBlockErr
          ref="pwdErr"
          errMsg={errMsg}
          convertedErrMsgs={CONTENT.ERR_MSG}
          clearErrMsg={clearErrMsg}
        />
        <RegBlockInput
          ref="oldPwd"
          icon="unlock-alt"
          type="password"
          placeHolder={EDIT_PROFILE.OLD_PWD}
        />
        <RegBlockInput
          ref="newPwd"
          icon="lock"
          type="password"
          placeHolder={EDIT_PROFILE.NEW_PWD}
        />
        <RegBlockInput
          ref="confirmNewPwd"
          icon="key"
          type="password"
          placeHolder={EDIT_PROFILE.CONFIRM_NEW_PWD}
        />
      </dl>
    );
  }

  render() {
    const {
      username,
      email,
      autobiography,
      isProcessing,
      errMsgs,
      clearErrMsgChangePassword
    } = this.props;
    const modalProps = {
      ref: 'modal',
      title: EDIT_PROFILE.TITLE,
      confirmBtn: {
        icon: 'floppy-o',
        className: 'btn btn-u pull-right rounded',
        text: EDIT_PROFILE.CONFIRM_BTN,
        onClick: this.handleClickConfirmBtn
      },
      isProcessing: isProcessing.updateProfile || isProcessing.changePassword
    };
    const profileContent = this.renderProfileContent(username, email, autobiography);
    const passwordContent = this.renderPasswordContent(errMsgs.changePassword, clearErrMsgChangePassword);
    const tabsContent = [{
      tab: EDIT_PROFILE.CONTENT.PROFILE,
      content: profileContent
    }, {
      tab: EDIT_PROFILE.CONTENT.PASSWORD,
      content: passwordContent
    }];

    return (
      <div className="profile-editor-component">
        <FlatButton
          className="profile-editor-btn"
          text={EDIT_PROFILE.TITLE}
          onClick={this.openModal}
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
