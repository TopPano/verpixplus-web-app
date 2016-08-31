'use strict';

import React, { Component } from 'react';

if (process.env.BROWSER) {
  require('./Intro.css');
}

const propTypes = {
};

const defaultProps = {
};

class Intro extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="intro-component">
        <div className="bg-image-v2 bg-image-v2-dark">
          <div className="container">
            <div className="headline-center-v2 margin-bottom-10">
              <h2>{"VerpixPlus is awesome"}</h2>
              <span className="bordered-icon"><i className="fa fa-th-large" /></span>
              <p>{"description here"}</p><br />
              <button type="button" className="btn-u btn-brd btn-brd-hover btn-u-light">{"Try it now"}</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Intro.propTypes = propTypes;
Intro.defaultProps = defaultProps;

export default Intro;
