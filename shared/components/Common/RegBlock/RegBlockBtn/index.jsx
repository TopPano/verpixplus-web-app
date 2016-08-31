'use strict';

import React, { Component, PropTypes } from 'react';

if (process.env.BROWSER) {
  require('./RegBlockBtn.css');
}

const propTypes = {
  handleClick: PropTypes.func.isRequired
};

const defaultProps = {
};

class RegBlockBtn extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { handleClick } = this.props;

    return (
      <div className="reg-block-btn-component row">
        <div className="col-md-10 col-md-offset-1">
          <button
            type="submit"
            className="btn-u btn-block"
            onClick={handleClick}
          >
            {"Log In"}
          </button>
        </div>
      </div>
    );
  }
}

RegBlockBtn.propTypes = propTypes;
RegBlockBtn.defaultProps = defaultProps;

export default RegBlockBtn;
