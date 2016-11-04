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
  updateProfilePicture: PropTypes.func.isRequired,
  updateProfile: PropTypes.func.isRequired,
  editAutobiography: PropTypes.func.isRequired,
  changePassword: PropTypes.func.isRequired,
  clearErrMsgChangePassword: PropTypes.func.isRequired
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
      updateProfilePicture,
      updateProfile,
      editAutobiography,
      changePassword,
      clearErrMsgChangePassword
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
          errMsgs={workspace.errMsgs}
          updateProfilePicture={updateProfilePicture}
          updateProfile={updateProfile}
          editAutobiography={editAutobiography}
          changePassword={changePassword}
          clearErrMsgChangePassword={clearErrMsgChangePassword}
        />
        <Gallery
          progressMedia={workspace.progressMedia.objs}
          progressMediaIds={workspace.progressMedia.ids}
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
