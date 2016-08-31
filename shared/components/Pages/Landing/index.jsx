'use strict';

import React, { Component } from 'react';

import Intro from './Intro';
import ServiceBlock from './ServiceBlock';

if (process.env.BROWSER) {
  require('./Landing.css');
}

const propTypes = {
};

const defaultProps = {
};

class Landing extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="landing-component">
        <Intro />
        <ServiceBlock />
      </div>
    );
  }
}

Landing.propTypes = propTypes;
Landing.defaultProps = defaultProps;

export default Landing;
