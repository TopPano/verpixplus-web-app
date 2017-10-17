'use strict';

import React, { Component, PropTypes } from 'react';

import FlatButton from 'components/Common/FlatButton';
import MultiTabsContent from 'components/Common/MultiTabsContent';
import Modal from 'components/Common/Modal';
import RegBlockInput from 'components/Common/RegBlock/RegBlockInput';
import RegBlockErr from 'components/Common/RegBlock/RegBlockErr';
import {
  checkPwd,
  checkPwdPair
} from 'components/Common/RegBlock/inputUtils';

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
  gaId: PropTypes.string.isRequired,
  autobiography: PropTypes.string.isRequired,
  isProcessing: PropTypes.object.isRequired,
  errMsgs: PropTypes.object.isRequired,
  updateProfile: PropTypes.func.isRequired,
  editGAId: PropTypes.func.isRequired,
  editAutobiography: PropTypes.func.isRequired,
  changePassword: PropTypes.func.isRequired,
  clearErrMsgChangePassword: PropTypes.func.isRequired
};

const defaultProps = {
};

class ProfileEditor extends Component {
  static contextTypes = { i18n: PropTypes.object };

  constructor(props) {
    super(props);

    // Bind "this" to member functions
    this.openModal = this.openModal.bind(this);
    this.handleChangeGAId = this.handleChangeGAId.bind(this);
    this.handleChangeAutobiography = this.handleChangeAutobiography.bind(this);
    this.handleClickConfirmBtn = this.handleClickConfirmBtn.bind(this);
  }

  // Update user profile
  updateProfile() {
    const {
      userId,
      gaId,
      autobiography,
      updateProfile
    } = this.props;

    updateProfile({
      userId,
      gaId,
      autobiography
    });
  }

  // Change user password
  changePassword() {
    this.refs.pwdErr.clear();

    const { i18n } = this.context;
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

    // Check password value
    const oldPwdErr = checkPwd(oldPwdVal, i18n, 'old password');
    if (oldPwdErr) {
      oldPwd.err(oldPwdErr);
      return;
    }
    // Check new password pair values
    const newPwdPairErr = checkPwdPair(newPwdVal, confirmNewPwdVal, i18n, 'new password')
    if (newPwdPairErr.err) {
      if (!newPwdPairErr.isConfirm) {
        newPwd.err(newPwdPairErr.err);
      } else {
        confirmNewPwd.err(newPwdPairErr.err);
      }
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

  // Handler for changing Google Analytics Tracking Id
  handleChangeGAId(e) {
    this.props.editGAId(e.target.value);
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
  renderProfileContent(username, email, gaId, autobiography) {
    const { l } = this.context.i18n;

    return (
      <dl className="profile-content dl-horizontal">
        <dt><strong>{l('Username')}</strong></dt>
        <dd>{username}</dd>
        <hr />
        <dt><strong>{l('Email')}</strong></dt>
        <dd>{email}</dd>
        <hr />
        <dt><strong>{l('GA Tracking Id')}</strong></dt>
        <dd>
          <input
            className="form-control"
            value={gaId}
            onChange={this.handleChangeGAId}
          />
        </dd>
        <hr />
        <dt><strong>{l('Autobiography')}</strong></dt>
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
    const { l } = this.context.i18n;

    return (
      <dl className="password-content dl-horizontal">
        <RegBlockErr
          ref="pwdErr"
          errMsg={errMsg}
          clearErrMsg={clearErrMsg}
        />
        <RegBlockInput
          ref="oldPwd"
          icon="unlock-alt"
          type="password"
          placeHolder={l('Old Password')}
        />
        <RegBlockInput
          ref="newPwd"
          icon="lock"
          type="password"
          placeHolder={l('New Password')}
        />
        <RegBlockInput
          ref="confirmNewPwd"
          icon="key"
          type="password"
          placeHolder={l('Confirm New Password')}
        />
      </dl>
    );
  }

  render() {
    const { l } = this.context.i18n;
    const {
      username,
      email,
      gaId,
      autobiography,
      isProcessing,
      errMsgs,
      clearErrMsgChangePassword
    } = this.props;
    const modalProps = {
      ref: 'modal',
      title: l('Edit Profile'),
      confirmBtn: {
        text: l('Save'),
        onClick: this.handleClickConfirmBtn
      },
      isProcessing: isProcessing.updateProfile || isProcessing.changePassword
    };
    const profileContent = this.renderProfileContent(username, email, gaId, autobiography);
    const passwordContent = this.renderPasswordContent(errMsgs.changePassword, clearErrMsgChangePassword);
    const tabsContent = [{
      tab: l('Profile'),
      content: profileContent
    }, {
      tab: l('Password'),
      content: passwordContent
    }];

    return (
      <div className="profile-editor-component">
        <FlatButton
          className="profile-editor-btn"
          text={l('Edit Profile')}
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
