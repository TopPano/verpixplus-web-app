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
    const {
      workspace,
      deleteMedia,
      loadMore
    } = this.props;

    return (
      <div className="workspace-component container container-fullpage">
        <Summary
          username={workspace.username}
          numOfMedia={workspace.numOfMedia}
        />
        <Gallery
          progressMedia={workspace.progressMedia.objs}
          progressMediaIds={workspace.progressMedia.ids}
          media={workspace.media.objs}
          mediaIds={workspace.media.ids}
          hasNext={workspace.media.hasNext}
          userId={workspace.userId}
          isProcessing={workspace.isProcessing}
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
