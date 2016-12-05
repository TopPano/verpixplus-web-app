'use strict';

import React, { PropTypes, Component } from 'react';
import classNames from 'classnames';
import Scrollbar from 'react-custom-scrollbars';
import isNumber from 'lodash/isNumber';

import FlatButton from 'components/Common/FlatButton';
import { click } from 'lib/events';
import MenuLinks from './MenuLinks';
import ProfileInfo from './ProfileInfo';
import ProfileEditor from './ProfileEditor';

const SWIPE_MIN_LENGTH = 5;

if (process.env.BROWSER) {
  require('./InfoPanel.css');
}

const propTypes = {
  user: PropTypes.object.isRequired,
  light: PropTypes.bool,
  links: PropTypes.arrayOf(PropTypes.shape({
    to: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired
  })),
  updateProfilePhoto: PropTypes.func.isRequired,
  updateProfile: PropTypes.func.isRequired,
  editAutobiography: PropTypes.func.isRequired,
  changePassword: PropTypes.func.isRequired,
  clearErrMsgChangePassword: PropTypes.func.isRequired,
  signout: PropTypes.func.isRequired
};

const defaultProps = {
  light: false,
  links: []
};

class InfoPanel extends Component {
  static contextTypes = { i18n: PropTypes.object };

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
    const { l } = this.context.i18n;
    const { isOpen } = this.state;
    const {
      light,
      links,
      updateProfilePhoto,
      updateProfile,
      editAutobiography,
      changePassword,
      clearErrMsgChangePassword
    } = this.props;
    const {
      userId,
      isAuthenticated,
      profilePhotoUrl,
      username,
      email,
      autobiography,
      numOfMedia,
      isProcessing,
      errMsgs
    } = this.props.user;
    const btnClass = classNames({
      'info-panel-btn clickable': true,
      'light': light
    });
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
          className={btnClass}
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
                isAuthenticated={isAuthenticated}
                profilePhotoUrl={profilePhotoUrl}
                username={username}
                email={email}
                numOfMedia={numOfMedia}
                isProcessing={isProcessing}
                updateProfilePhoto={updateProfilePhoto}
              />
              <MenuLinks
                isAuthenticated={isAuthenticated}
                links={links}
                close={this.close}
              />
              <div style={{ paddingTop: '100px' }} />
              {
                isAuthenticated &&
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
              }
              {
                isAuthenticated &&
                <FlatButton
                  className="menu-signout"
                  text={l('Sign Out')}
                  onClick={this.handleClickSignoutBtn}
                />
              }
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
