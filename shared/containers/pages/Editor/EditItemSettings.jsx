'use strict';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { playerSetAutoplay } from 'actions/editor';
import {
  createMedia,
  updateMedia
} from 'actions/media';
import EditItemSettings from 'components/Pages/Editor/EditPanel/EditItemSettings';

const propTypes = {
  editor: PropTypes.object.isRequired
};

const defaultProps = {
};

class EditItemSettingsContainer extends Component {
  constructor(props) {
    super(props);

    // Bind "this" to member function
    this.playerSetAutoplay = this.playerSetAutoplay.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
  }

  // Wrapper for dispatching playerSetAutoplay function,
  // which enables/disables the autoplay option
  playerSetAutoplay(autoplay) {
    this.props.dispatch(playerSetAutoplay(autoplay));
  }

  // Wrapper for dispatching createMedia function,
  // which create a post for livephoto or panophoto
  create(params) {
    this.props.dispatch(createMedia(params));
  }

  // Wrapper for dispatching updateMedia function,
  // which updates the contents of a post
  update(params) {
    this.props.dispatch(updateMedia(params));
  }

  render() {
    const { editor } = this.props;

    return (
      <EditItemSettings
        {...editor}
        playerSetAutoplay={this.playerSetAutoplay}
        create={this.create}
        update={this.update}
      />
    );
  }
}

EditItemSettingsContainer.propTypes = propTypes;
EditItemSettingsContainer.defaultProps = defaultProps;

function mapStateToProps(state) {
  const { editor } = state;
  return {
    editor
  };
}

export default connect(mapStateToProps)(EditItemSettingsContainer);
