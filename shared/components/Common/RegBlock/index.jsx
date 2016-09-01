'use strict';

import React, { Component, PropTypes } from 'react';

if (process.env.BROWSER) {
  require('./RegBlock.css');
}

const propTypes = {
  handleSubmit: PropTypes.func.isRequired
};

const defaultProps = {
};

class RegBlock extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { handleSubmit } = this.props;

    return (
      <div className="reg-block-component container container-center-row">
        <form
          className="reg-block"
          onSubmit={handleSubmit}
        >
          {this.props.children}
        </form>
      </div>
    );
  }
}

RegBlock.propTypes = propTypes;
RegBlock.defaultProps = defaultProps;

export default RegBlock;
