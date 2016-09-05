'use strict';

import React, { Component } from 'react';

import Service from './Service';

if (process.env.BROWSER) {
  require('./ServiceBlock.css');
}

const propTypes = {
};

const defaultProps = {
};

export default class ServiceBlock extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="service-block-component container content-sm">
        <div className="row">
          <Service
            icon="link"
            name="Service name 1"
            desc="Service description 1"
          />
          <Service
            icon="paper-plane"
            name="Service name 2"
            desc="Service description 2"
          />
          <Service
            icon="refresh"
            name="Service name 3"
            desc="Service description 3"
          />
        </div>
      </div>
    );
  }
}

ServiceBlock.propTypes = propTypes;
ServiceBlock.defaultProps = defaultProps;

export default ServiceBlock;
