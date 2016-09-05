'use strict';

import React, { Component } from 'react';

if (process.env.BROWSER) {
  require('./RegBlockOthers.css');
}

const propTypes = {
};

const defaultProps = {
};

class RegBlockOthers extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="reg-block-others-component checkbox">
        <label>
          {this.props.children}
        </label>
      </div>
    );
  }
}

RegBlockOthers.propTypes = propTypes;
RegBlockOthers.defaultProps = defaultProps;

export default RegBlockOthers;
