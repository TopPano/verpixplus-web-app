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
  username: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  profilePhotoUrl: PropTypes.string.isRequired,
  numOfMedia: PropTypes.number.isRequired
};

const defaultProps = {
};

class Summary extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      username,
      email,
      profilePhotoUrl,
      numOfMedia
    } = this.props;

    return (
      <div className="summary-component breadcrumbs">
        <div className="summary-wrapper container">
          <Row>
            <Col
              className="container-center-row"
              sm={4}
            >
              <ProfilePhoto profilePhotoUrl={profilePhotoUrl} />
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
                username={username}
                email={email}
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
