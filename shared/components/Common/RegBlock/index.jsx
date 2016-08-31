'use strict';

import React, { Component } from 'react';

if (process.env.BROWSER) {
  require('./RegBlock.css');
}

const propTypes = {
};

const defaultProps = {
};

class RegBlock extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="reg-block-component container container-center-row">
        <div className="reg-block">
          {this.props.children}
        </div>
      </div>
    );
  }
}

RegBlock.propTypes = propTypes;
RegBlock.defaultProps = defaultProps;

export default RegBlock;
