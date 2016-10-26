'use strict';

import React, { Component, PropTypes } from 'react';

import Summary from './Summary';
import Gallery from 'components/Common/Gallery';

if (process.env.BROWSER) {
  require('./WorkSpace.css');
}

const propTypes = {
  user: PropTypes.object.isRequired,
  workspace: PropTypes.object.isRequired,
  deleteMedia: PropTypes.func.isRequired,
  loadMore: PropTypes.func.isRequired,
  updateProfilePicture: PropTypes.func.isRequired
};

const defaultProps = {
}

class WorkSpace extends Component {
  render() {
    const {
      user,
      workspace,
      deleteMedia,
      loadMore,
      updateProfilePicture
    } = this.props;

    return (
      <div className="workspace-component container-fullpage">
        <Summary
          username={workspace.username}
          userId={user.userId}
          email={user.email}
          profilePhotoUrl={workspace.profilePhotoUrl}
          autobiography={workspace.autobiography}
          isProcessing={workspace.isProcessing}
          numOfMedia={workspace.numOfMedia}
          updateProfilePicture={updateProfilePicture}
        />
        <Gallery
          media={workspace.media.objs}
          mediaIds={workspace.media.ids}
          hasNext={workspace.media.hasNext}
          userId={workspace.userId}
          isFetching={workspace.isFetching}
          deleteMedia={deleteMedia}
          loadMore={loadMore}
        />
      </div>
    );
  }
}

WorkSpace.propTypes = propTypes;
WorkSpace.defaultProps = defaultProps;

export default WorkSpace;
