'use strict';

import React, { Component, PropTypes } from 'react';

if (process.env.BROWSER) {
  require('./Service.css');
}

const propTypes = {
  icon: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  desc: PropTypes.string.isRequired
};

const defaultProps = {
};

class Service extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { icon, name, desc } = this.props;

    return (
      <div className="service-component col-md-4 content-boxes-v6 md-margin-bottom-50">
        <i className={`rounded-x icon-${icon}`}></i>
        <h1 className="title-v3-md text-uppercase margin-bottom-10">{name}</h1>
        <p>{desc}</p>
      </div>
    );
  }
}

Service.propTypes = propTypes;
Service.defaultProps = defaultProps;

export default Service;
