'use strict';

import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';

import { connectDataFetchers } from 'lib/utils';
import {
  loadUserSummary,
  updateProfilePicture,
  updateProfile,
  editAutobiography,
  changePassword,
  clearErrMsgChangePassword,
  logoutUser
} from 'actions/user';
import InfoPanel from 'components/Common/InfoPanel';

const propTypes = {
  user: PropTypes.object.isRequired,
  light: PropTypes.bool,
  links: PropTypes.arrayOf(PropTypes.shape({
    to: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired
  }))
};

const defaultProps = {
  light: false,
  links: []
};

class InfoPanelPageContainer extends Component {
  constructor(props) {
    super(props);

    // Bind "this" to member function
    this.updateProfilePhoto = this.updateProfilePhoto.bind(this);
    this.updateProfile = this.updateProfile.bind(this);
    this.editAutobiography = this.editAutobiography.bind(this);
    this.changePassword = this.changePassword.bind(this);
    this.clearErrMsgChangePassword = this.clearErrMsgChangePassword.bind(this);
    this.signout = this.signout.bind(this);
  }

  // Wrapper function for dispatching updateProfilePicture,
  // which updates the profile photo of user
  updateProfilePhoto(params) {
    this.props.dispatch(updateProfilePicture(params));
  }

  // Wrapper function for dispatching updateProfile,
  // which updates the profile content of user
  updateProfile(params) {
    this.props.dispatch(updateProfile(params));
  }

  // Wrapper function for dispatching editAutobiography
  // which edits then content of autobiography
  editAutobiography(autobiography) {
    this.props.dispatch(editAutobiography(autobiography));
  }

  // Wrapper function for dispatching changePassword,
  // which changes the password of user
  changePassword(params) {
    this.props.dispatch(changePassword(params));
  }

  // Wrapper function for dispatching clearErrMsgChangePassword,
  // which clears the error message when user changes password.
  clearErrMsgChangePassword() {
    this.props.dispatch(clearErrMsgChangePassword());
  }

  // Wrapper function for dispatching logoutUser,
  // which signouts the current user
  signout() {
    this.props.dispatch(logoutUser());
  }

  render() {
    return (
      <InfoPanel
        {...this.props}
        updateProfilePhoto={this.updateProfilePhoto}
        updateProfile={this.updateProfile}
        editAutobiography={this.editAutobiography}
        changePassword={this.changePassword}
        clearErrMsgChangePassword={this.clearErrMsgChangePassword}
        signout={this.signout}
      />
    );
  }
}

InfoPanelPageContainer.propTypes = propTypes;
InfoPanelPageContainer.defaultProps = defaultProps;

function mapStateToProps(state, ownProps) {
  const { user } = state;

  return {
    user,
    ...ownProps
  };
}

export default connect(mapStateToProps)(
  connectDataFetchers(InfoPanelPageContainer, [ loadUserSummary ])
);
