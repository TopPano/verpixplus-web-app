'use strict';

import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

import CONTENT from 'content/workspace/en-us.json';
import { renderList } from 'lib/utils';
import IconButton from 'components/Common/IconButton';
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

    // Initialize state
    this.state = {
      activeIdx: 0
    };
  }

  // handle for clicking button
  openModal() {
    this.refs.modal.open();
  }

  // handle for clicking tab
  selectTab(idx) {
    this.setState({
      activeIdx: idx
    });
  }

  // Render list of tabs
  renderTabs(propsList, activeIdx) {
    return renderList(propsList, (props, idx) => {
      const tabClass = classNames({
        'active': idx === activeIdx,
        'clickable': true
      });

      return (
        <li
          key={idx}
          className={tabClass}
          onClick={() => { this.selectTab(idx) }}
        >
          <a>{props.text}</a>
        </li>
      );
    });
  }

  // Render content for editting profile
  renderProfileContent(username, email) {
    return (
      <dl className="dl-horizontal">
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

  // Render all content
  renderAllContent(contentList, activeIdx) {
    return renderList(contentList, (content, idx) => {
      const contentClass = classNames({
        'active': idx === activeIdx,
        'in': idx === activeIdx,
        'profile-edit': true,
        'tab-pane': true,
        'fade': true
      });

      return (
        <div className={contentClass}>
          {content}
        </div>
      );
    });
  }

  render() {
    const { activeIdx } = this.state;
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
    const tabsProps = [{
      text: CONTENT.EDIT_PROFILE.CONTENT.PROFILE
    }, {
      text: CONTENT.EDIT_PROFILE.CONTENT.PASSWORD
    }];
    const tabs = this.renderTabs(tabsProps, activeIdx);
    const profileContent = this.renderProfileContent(username, email);
    const passwordContent = this.renderPasswordContent();
    const allContent = this.renderAllContent([profileContent, passwordContent], activeIdx);

    return (
      <div className="profile-editor-component">
        <IconButton
          className="profile-editor-component btn btn-u rounded"
          icon="pencil"
          text={CONTENT.EDIT_PROFILE.TITLE}
          handleClick={this.openModal}
        />
        <Modal {...modalProps}>
          <div className="profile-body">
            <div className="tab-v1">
              <ul className="nav nav-justified nav-tabs">
                {tabs}
              </ul>
            </div>
            <div className="tab-content margin-top-20">
              {allContent}
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

ProfileEditor.propTypes = propTypes;
ProfileEditor.defaultProps = defaultProps;

export default ProfileEditor;
