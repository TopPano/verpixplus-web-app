'use strict';

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import { connectDataFetchers } from 'lib/utils';
import {
  loadUserSummary,
  updateProfilePicture
} from 'actions/user';
import { loadUserMedia, deleteMedia } from 'actions/media';
import ScrollablePageContainer from './Scrollable';
import WorkSpace from 'components/Pages/WorkSpace';

const propTypes = {
  user: PropTypes.object.isRequired,
  workspace: PropTypes.object.isRequired
};

const defaultProps = {
};

class WorkSpacePageContainer extends ScrollablePageContainer {
  constructor(props) {
    super(props);

    // Initialize state
    this.state = {
      isLoadMoreEnabled: false
    };

    // Bind "this" to member function
    this.deleteMedia = this.deleteMedia.bind(this);
    this.loadMore = this.loadMore.bind(this);
    this.updateProfilePicture = this.updateProfilePicture.bind(this);
  }

  // Overide parent member function
  hasMoreContent = () => {
    return this.props.workspace.media.hasNext;
  }

  // Overide parent member function
  isFetchingContent() {
    return this.props.workspace.isFetching;
  }

  // Overide parent member function
  isLoadMoreEnabled() {
    return this.state.isLoadMoreEnabled;
  }

  // Overide parent member function
  requestMoreContent() {
    const {
      workspace,
      dispatch
    } = this.props;
    const {
      userId,
      media: {
        lastMediaId
      }
    } = workspace;

    dispatch(loadUserMedia({
      id: userId,
      lastMediaId
    }));
  }

  // Handler for clicking more-button, pass to sub-components
  loadMore() {
    if (!this.state.isLoadMoreEnabled) {
      this.setState({
        isLoadMoreEnabled: true
      });
    }

    this.requestMoreContent();
  }

  // Wrapper function for dispatching deleteMedia,
  // which deletes a media from media list.
  deleteMedia(params) {
    this.props.dispatch(deleteMedia(params));
  }

  // Wrapper function for dispatching updateProfilePicture,
  // which updates the profile picture of user
  updateProfilePicture(params) {
    this.props.dispatch(updateProfilePicture(params));
  }

  render() {
    const {
      user,
      workspace
    } = this.props;

    return (
      <WorkSpace
        user={user}
        workspace={workspace}
        deleteMedia={this.deleteMedia}
        loadMore={this.loadMore}
        updateProfilePicture={this.updateProfilePicture}
      />
    );
  }
}

WorkSpacePageContainer.propTypes = propTypes;
WorkSpacePageContainer.defaultProps = defaultProps;

function mapStateToProps(state) {
  // Retrieve the user state in order for DataFetcher to be able to access the user session
  const { user, workspace } = state;
  return {
    user,
    workspace
  };
}

export default connect(mapStateToProps)(
  connectDataFetchers(WorkSpacePageContainer, [ loadUserSummary, loadUserMedia ])
);
