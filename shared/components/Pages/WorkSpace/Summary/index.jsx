'use strict';

import React, { Component, PropTypes } from 'react';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';

import ProfilePhoto from './ProfilePhoto';
import ProfileInfo from './ProfileInfo';
import ProfileEditor from './ProfileEditor';

if (process.env.BROWSER) {
  require('./Summary.css');
}

const propTypes = {
  userId: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  profilePhotoUrl: PropTypes.string.isRequired,
  autobiography: PropTypes.string.isRequired,
  numOfMedia: PropTypes.number.isRequired,
  isProcessing: PropTypes.object.isRequired,
  errMsgs: PropTypes.object.isRequired,
  updateProfilePicture: PropTypes.func.isRequired,
  updateProfile: PropTypes.func.isRequired,
  editAutobiography: PropTypes.func.isRequired,
  changePassword: PropTypes.func.isRequired,
  clearErrMsgChangePassword: PropTypes.func.isRequired
};

const defaultProps = {
};

class Summary extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      userId,
      username,
      email,
      profilePhotoUrl,
      autobiography,
      numOfMedia,
      isProcessing,
      errMsgs,
      updateProfilePicture,
      updateProfile,
      editAutobiography,
      changePassword,
      clearErrMsgChangePassword
    } = this.props;

    return (
      <div className="summary-component breadcrumbs">
        <div className="summary-wrapper container">
          <Row>
            <Col
              className="container-center-row"
              sm={4}
            >
              <ProfilePhoto
                userId={userId}
                profilePhotoUrl={profilePhotoUrl}
                isProcessing={isProcessing}
                updateProfilePicture={updateProfilePicture}
              />
            </Col>
            <Col
              className="profile-info-wrapper"
              sm={6}
            >
              <ProfileInfo
                username={username}
                email={email}
                numOfMedia={numOfMedia}
              />
            </Col>
            <Col
              className="container-center-row"
              sm={2}
            >
              <ProfileEditor
                userId={userId}
                username={username}
                email={email}
                autobiography={autobiography}
                isProcessing={isProcessing}
                errMsgs={errMsgs}
                editAutobiography={editAutobiography}
                updateProfile={updateProfile}
                changePassword={changePassword}
                clearErrMsgChangePassword={clearErrMsgChangePassword}
              />
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

Summary.propTypes = propTypes;
Summary.defaultProps = defaultProps;

export default Summary;
