'use strict';

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import { connectDataFetchers } from 'lib/utils';
import { loadUserSummary } from 'actions/user';
import { loadUserMedia, deleteMedia } from 'actions/media';
import { clearWorkspaceErr } from 'actions/workspace';
import ScrollablePageContainer from './Scrollable';
import WorkSpace from 'components/Pages/WorkSpace';

const propTypes = {
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
    this.clearErr = this.clearErr.bind(this);
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

  // Wrapper function for dispatching clearWorkspaceErr,
  // which clears the error of workspace state
  clearErr() {
    this.props.dispatch(clearWorkspaceErr());
  }

  render() {
    const { workspace } = this.props;

    return (
      <WorkSpace
        workspace={workspace}
        deleteMedia={this.deleteMedia}
        loadMore={this.loadMore}
        clearErr={this.clearErr}
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
