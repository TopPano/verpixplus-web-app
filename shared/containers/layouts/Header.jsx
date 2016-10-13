'use strict';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import Header from 'components/Layouts/Header';
import { logoutUser } from 'actions/user';

const propTypes = {
  isAuthenticated: PropTypes.bool.isRequired
};

const defaultProps = {
};

class HeaderContainer extends Component {
  constructor(props) {
    super(props);

    // Bind "this" to member function
    this.logout = this.logout.bind(this);
  }

  logout() {
    this.props.dispatch(logoutUser());
  }

  render() {
    const { isAuthenticated } = this.props;

    return (
      <Header
        isAuthenticated={isAuthenticated}
        logout={this.logout}
      />
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
