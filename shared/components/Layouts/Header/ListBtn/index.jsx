'use strict';

import React, { Component, PropTypes } from 'react';

if (process.env.BROWSER) {
  require('./ListBtn.css');
}

const propTypes = {
  handleClick: PropTypes.func.isRequired
};

const defaultProps = {
};

class ListBtn extends Component {
  render() {
    const { handleClick } = this.props;

    return (
      <button
        type="button"
        className="list-btn-component navbar-toggle"
        onClick={handleClick}
      >
        <span className="sr-only">Toggle navigation</span>
        <span className="fa fa-bars" />
      </button>
    );
  }
}

ListBtn.propTypes = propTypes;
ListBtn.defaultProps = defaultProps;

export default ListBtn;
