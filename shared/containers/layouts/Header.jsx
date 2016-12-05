'use strict';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import Header from 'components/Layouts/Header';

const propTypes = {
  isAuthenticated: PropTypes.bool.isRequired
};

const defaultProps = {
};

class HeaderContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { isAuthenticated } = this.props;

    return (
      <Header isAuthenticated={isAuthenticated} />
    );
  }
}

HeaderContainer.propTypes = propTypes;
HeaderContainer.defaultProps = defaultProps;

function mapStateToProps(state) {
  const { isAuthenticated } = state.user;
  return {
    isAuthenticated
  }
}

export default connect(mapStateToProps)(HeaderContainer);
