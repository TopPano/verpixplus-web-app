'use strict';

import React, { PropTypes, Component } from 'react';
import classNames from 'classnames';
import Scrollbar from 'react-custom-scrollbars';
import isNumber from 'lodash/isNumber';

import CONTENT from 'content/common/en-us.json';
import FlatButton from 'components/Common/FlatButton';
import { click } from 'lib/events';
import MenuLinks from './MenuLinks';
import ProfileInfo from './ProfileInfo';
import ProfileEditor from './ProfileEditor';

const { INFO_PANEL } = CONTENT;
const SWIPE_MIN_LENGTH = 5;

if (process.env.BROWSER) {
  require('./InfoPanel.css');
}

const propTypes = {
  user: PropTypes.object.isRequired,
  updateProfilePhoto: PropTypes.func.isRequired,
  updateProfile: PropTypes.func.isRequired,
  editAutobiography: PropTypes.func.isRequired,
  changePassword: PropTypes.func.isRequired,
  clearErrMsgChangePassword: PropTypes.func.isRequired,
  signout: PropTypes.func.isRequired
};

const defaultProps = {
};

class InfoPanel extends Component {
  constructor(props) {
    super(props);

    // Initialize state
    this.state = {
      isOpen: false,
      startX: null,
      lastX: null
    };

    // Bind "this" to member functions
    this.toggle = this.toggle.bind(this);
    this.close = this.close.bind(this);
    this.handleClickSignoutBtn = this.handleClickSignoutBtn.bind(this);
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleTouchMove = this.handleTouchMove.bind(this);
    this.handleTouchEnd = this.handleTouchEnd.bind(this);
  }

  // Open/Close the panel
  toggle() {
    this.setState({
      isOpen: !this.state.isOpend
    });
  }

  // Close the panel
  close() {
    this.setState({
      isOpen: false
    });
  }

  // Handler for clicking button to signout
  handleClickSignoutBtn() {
    this.close();
    this.props.signout();
  }

  // Handler for touch start
  handleTouchStart(e) {
    this.setState({
      startX: click.getX(e)
    });
  }

  // Handler for touch move
  handleTouchMove(e) {
    this.setState({
      lastX: click.getX(e)
    });
  }

  // Handler for touch end
  handleTouchEnd() {
    const {
      startX,
      lastX
    } = this.state;

    if (isNumber(lastX) && isNumber(startX) && ((lastX - startX) > SWIPE_MIN_LENGTH)) {
      this.close();
    }

    this.setState({
      startX: null,
      lastX: null
    })
  }

  render() {
    const { isOpen } = this.state;
    const {
      updateProfilePhoto,
      updateProfile,
      editAutobiography,
      changePassword,
      clearErrMsgChangePassword
    } = this.props;
    const {
      userId,
      profilePhotoUrl,
      username,
      email,
      autobiography,
      numOfMedia,
      isProcessing,
      errMsgs
    } = this.props.user;
    const overlayClass = classNames({
      'info-panel-overlay': true,
      'open': isOpen
    });
    const menuClass = classNames({
      'info-panel-menu': true,
      'open': isOpen
    });

    return (
      <div className="info-panel-component">
        <div
          className="info-panel-btn clickable"
          onClick={this.toggle}
        >
          <div className="colelem" />
          <div className="colelem" />
          <div className="colelem" />
        </div>
        <div
          onMouseDown={this.handleTouchStart}
          onTouchStart={this.handleTouchStart}
          onMouseMove={this.handleTouchMove}
          onTouchMove={this.handleTouchMove}
          onMouseUp={this.handleTouchEnd}
          onTouchEnd={this.handleTouchEnd}
        >
          <div
            className={overlayClass}
            onClick={this.close}
          />
          <div className={menuClass}>
            <Scrollbar universal>
              <div
                className="menu-root-close clickable"
                onClick={this.close}
              />
              <ProfileInfo
                userId={userId}
                profilePhotoUrl={profilePhotoUrl}
                username={username}
                email={email}
                numOfMedia={numOfMedia}
                isProcessing={isProcessing}
                updateProfilePhoto={updateProfilePhoto}
              />
              <MenuLinks close={this.close} />
              <div style={{ paddingTop: '100px' }} />
              <ProfileEditor
                userId={userId}
                username={username}
                email={email}
                autobiography={autobiography}
                errMsgs={errMsgs}
                updateProfile={updateProfile}
                editAutobiography={editAutobiography}
                changePassword={changePassword}
                clearErrMsgChangePassword={clearErrMsgChangePassword}
                isProcessing={isProcessing}
              />
              <FlatButton
                className="menu-signout"
                text={INFO_PANEL.SIGNOUT}
                onClick={this.handleClickSignoutBtn}
              />
            </Scrollbar>
          </div>
        </div>
      </div>
    );
  }
}

InfoPanel.propTypes = propTypes;
InfoPanel.defaultProps = defaultProps;

export default InfoPanel;
