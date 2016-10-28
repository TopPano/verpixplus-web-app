'use strict';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { connectDataFetchers } from 'lib/utils';
import {
  initEditor,
  convert,
  playerPlay,
  playerPause,
  playerSetAutoplay,
  trim,
  edit,
  adjustFilters,
  applyFilters
} from 'actions/editor';
import { createMedia } from 'actions/media';
import Editor from 'components/Pages/Editor';

const propTypes = {
  editor: PropTypes.object.isRequired
};

const defaultProps = {
};

class EditorPageContainer extends Component {
  constructor(props) {
    super(props);

    // Bind "this" to member function
    this.convertFile = this.convertFile.bind(this);
    this.playerPlay = this.playerPlay.bind(this);
    this.playerPause = this.playerPause.bind(this);
    this.playerSetAutoplay = this.playerSetAutoplay.bind(this);
    this.edit = this.edit.bind(this);
    this.adjustFilters = this.adjustFilters.bind(this);
    this.applyFilters = this.applyFilters.bind(this);
    this.create = this.create.bind(this);
    this.trim = this.trim.bind(this);
  }

  // Wrapper for dispatching convert function,
  // which convert a video to a series of frames (livephoto)
  // or convet an image to panophoto
  convertFile({ mediaType, source }) {
    this.props.dispatch(convert({ mediaType, source }));
  }

  // Wrapper for dispatching playerPlay function,
  // which enable the palyer starts playing
  playerPlay() {
    this.props.dispatch(playerPlay());
  }

  // Wrapper for dispatching playerPause function,
  // which enable the palyer pause playing
  playerPause() {
    this.props.dispatch(playerPause());
  }

  // Wrapper for dispatching playerSetAutoplay function,
  // which enables/disables the autoplay option
  playerSetAutoplay(autoplay) {
    this.props.dispatch(playerSetAutoplay(autoplay));
  }

  // Wrapper for dispatching trim function,
  // which trims the range of frames
  trim({ lower, upper }) {
    this.props.dispatch(trim({
      lower,
      upper
    }));
  }

  // Wrapper for dispatching edit function,
  // which update the content related to this media
  edit({ title, caption }) {
    this.props.dispatch(edit({
      title,
      caption
    }));
  }

  // Wrapper for dispatching adjustFilters function,
  // which updates the filter values of this media
  adjustFilters(filters) {
    this.props.dispatch(adjustFilters(filters));
  }

  // Wrapper for dispatching applyFilters function,
  // which updates the filter values to original data
  applyFilters({ data, dimension,filters}) {
    this.props.dispatch(applyFilters({
      data,
      dimension,
      filters
    }));
  }

  // Wrapper for dispatching createMedia function,
  // which create a post for livephoto or panophoto
  create(params) {
    this.props.dispatch(createMedia(params));
  }

  render() {
    const { editor } = this.props;

    return (
      <Editor
        {...editor}
        convertFile={this.convertFile}
        playerPlay={this.playerPlay}
        playerPause={this.playerPause}
        playerSetAutoplay={this.playerSetAutoplay}
        trim={this.trim}
        edit={this.edit}
        adjustFilters={this.adjustFilters}
        applyFilters={this.applyFilters}
        create={this.create}
      >
        {this.props.children}
      </Editor>
    );
  }
}

EditorPageContainer.propTypes = propTypes;
EditorPageContainer.defaultProps = defaultProps;

function mapStateToProps(state) {
  const { editor } = state;
  return {
    editor
  };
}

export default connect(mapStateToProps)(
  connectDataFetchers(EditorPageContainer, [ initEditor ])
);
