'use strict';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { deleteMedia } from 'actions/media';
import DeleteModal from 'components/Common/DeleteModal';

const propTypes = {
  mediaId: PropTypes.string.isRequired,
  isProcessing: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired
};

const defaultProps = {
};

class DeleteModalContainer extends Component {
  constructor(props) {
    super(props);

    // Bind "this" to member functions
    this.deleteMedia = this.deleteMedia.bind(this);
  }

  // Wrapper function for dispatching deleteMedia,
  // which deletes a media from media list.
  deleteMedia(params) {
    this.props.dispatch(deleteMedia(params));
  }

  render() {
    const {
      mediaId,
      isProcessing,
      children
    } = this.props;

    return (
      <DeleteModal
        ref="modal"
        mediaId={mediaId}
        isProcessing={isProcessing}
        deleteMedia={this.deleteMedia}
      >
        {children}
      </DeleteModal>
    );
  }
}

DeleteModalContainer.propTypes = propTypes;
DeleteModalContainer.defaultProps = defaultProps;

function mapStateToProps(state, ownProps) {
  return ownProps;
}

export default connect(mapStateToProps)(DeleteModalContainer);
