'use strict';

import React, { Component, PropTypes } from 'react';

import CONTENT from 'content/workspace/en-us.json';

if (process.env.BROWSER) {
  require('./ProfileInfo.css');
}

const propTypes = {
  username: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  numOfMedia: PropTypes.number.isRequired
};

const defaultProps = {
};

class ProfileInfo extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      username,
      email,
      numOfMedia
    } = this.props;

    return (
      <div className="profile-info-component">
        <h1><strong>{username}</strong></h1>
        <h5>{email}</h5>
        <div className="service-block-v3 margin-top-10">
          <i className="fa fa-files-o" />
          <span className="service-heading">{CONTENT.OVERALL.MEDIA}</span>
          <span className="counter">{numOfMedia}</span>
        </div>
      </div>
    );
  }
}

ProfileInfo.propTypes = propTypes;
ProfileInfo.defaultProps = defaultProps;

export default ProfileInfo;
