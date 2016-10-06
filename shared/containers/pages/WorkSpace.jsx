'use strict';

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import { connectDataFetchers } from 'lib/utils';
import { loadUserSummary } from 'actions/user';
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

    // Bind "this" to member function
    this.deleteMedia = this.deleteMedia.bind(this);
  }

  hasMoreContent = () => {
    return this.props.workspace.posts.hasNext;
  }

  isFetchingContent() {
    return this.props.workspace.isFetching;
  }

  requestMoreContent() {
    const { dispatch } = this.props;
    const { userId, media: { lastMediaId } } = this.props.workspace;
    dispatch(loadUserMedia({
      userId,
      lastMediaId
    }));
  }

  deleteMedia(params) {
    this.props.dispatch(deleteMedia(params));
  }


  render() {
    const { workspace } = this.props;

    return (
      <WorkSpace
        workspace={workspace}
        deleteMedia={this.deleteMedia}
        loadMore={this.loadMoreContent}
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
