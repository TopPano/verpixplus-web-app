'use strict';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createVideo } from 'actions/media';

import ShareModal from 'components/Common/ShareModal';

const propTypes = {
  mediaId: PropTypes.string.isRequired,
  isVideoCreated: PropTypes.bool.isRequired,
  isProcessing: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired
};

const defaultProps = {
};

class ShareModalContainer extends Component {
  constructor(props) {
    super(props);

    // Bind "this" to member functions
    this.createVideo = this.createVideo.bind(this);
  }

  createVideo({ mediaId }) {
    this.props.dispatch(createVideo({ mediaId }));
  }

  render() {
    const {
      mediaId,
      isVideoCreated,
      isProcessing,
      children
    } = this.props;

    return (
      <ShareModal
        ref="modal"
        mediaId={mediaId}
        isVideoCreated={isVideoCreated}
        isProcessing={isProcessing}
        createVideo={this.createVideo}
      >
        {children}
      </ShareModal>
    );
  }
}

ShareModalContainer.propTypes = propTypes;
ShareModalContainer.defaultProps = defaultProps;

function mapStateToProps(state, ownProps) {
  return ownProps;
}

export default connect(mapStateToProps)(ShareModalContainer);
