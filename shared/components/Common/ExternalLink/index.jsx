'use strict';

import React, { Component, PropTypes } from 'react';

if (process.env.BROWSER) {
  require('./ExternalLink.css');
}

const propTypes = {
  to: PropTypes.string
};

const defaultProps = {
  to: '#'
};

class ExternalLink extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { to, children } = this.props;

    return (
      <a
        className="external-link-component"
        target="_blank"
        href={to}
      >
        {children}
      </a>
    );
  }
}

ExternalLink.propTypes = propTypes;
ExternalLink.defaultProps = defaultProps;

export default ExternalLink;
