'use strict';

import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

if (process.env.BROWSER) {
  require('./RegBlockHeader.css');
}

const propTypes = {
  title: PropTypes.string.isRequired,
  switchTo: PropTypes.shape({
    desc: PropTypes.string.isRequired,
    url: PropTypes.string,
    name: PropTypes.string
  }).isRequired
};

const defaultProps = {
};

class RegBlockHeader extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      title,
      switchTo
    } = this.props;

    return (
      <div className="reg-block-header-component reg-block-header">
        <h2>{title}</h2>
        <p>
          {`${switchTo.desc} `}
          {
            switchTo.url &&
            switchTo.name &&
            <Link to={switchTo.url}>{switchTo.name}</Link>
          }
        </p>
      </div>
    );
  }
}

RegBlockHeader.propTypes = propTypes;
RegBlockHeader.defaultProps = defaultProps;

export default RegBlockHeader;
