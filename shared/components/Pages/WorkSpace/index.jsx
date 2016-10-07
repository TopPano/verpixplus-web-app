'use strict';

import React, { Component, PropTypes } from 'react';

import Summary from './Summary';
import Gallery from 'components/Common/Gallery';

if (process.env.BROWSER) {
  require('./WorkSpace.css');
}

const propTypes = {
  workspace: PropTypes.object.isRequired,
  deleteMedia: PropTypes.func.isRequired,
  loadMore: PropTypes.func.isRequired
};

const defaultProps = {
}

class WorkSpace extends Component {
  render() {
    const { workspace, deleteMedia, loadMore } = this.props;

    return (
      <div className="workspace-component container-fullpage">
        <Summary
          username={workspace.username}
          profilePhotoUrl={workspace.profilePhotoUrl}
          autobiography={workspace.autobiography}
          numOfMedia={workspace.numOfMedia}
        />
        <Gallery
          media={workspace.media.objs}
          mediaIds={workspace.media.ids}
          hasNext={workspace.media.hasNext}
          userId={workspace.userId}
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
