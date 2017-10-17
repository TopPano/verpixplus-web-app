'use strict';

import React, { Component, PropTypes } from 'react';

if (process.env.BROWSER) {
  require('./RegBlockBtn.css');
}

const propTypes = {
  text: PropTypes.string.isRequired
};

const defaultProps = {
};

class RegBlockBtn extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { text } = this.props;

    return (
      <div className="reg-block-btn-component row">
        <div className="col-md-10 col-md-offset-1">
          <button
            type="submit"
            className="reg-block-btn flat-button-component"
          >
            {text}
          </button>
        </div>
      </div>
    );
  }
}

RegBlockBtn.propTypes = propTypes;
RegBlockBtn.defaultProps = defaultProps;

export default RegBlockBtn;
