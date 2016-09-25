'use strict';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { connectDataFetchers } from 'lib/utils';
import {
  initEditor,
  convert,
  edit,
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
    this.edit = this.edit.bind(this);
    this.applyFilters = this.applyFilters.bind(this);
    this.create = this.create.bind(this);
  }

  // Wrapper for dispatching convert function,
  // which convert a video to a series of frames (livephoto)
  // or convet an image to panophoto
  convertFile({ mediaType, source }) {
    this.props.dispatch(convert({ mediaType, source }));
  }

  // Wrapper for dispatching edit function,
  // which update the content related to this media
  edit({ title, caption }) {
    this.props.dispatch(edit({
      title,
      caption
    }));
  }

  // Wrapper for dispatching applyFilters function,
  // which update the filters of this media
  applyFilters(filters) {
    this.props.dispatch(applyFilters(filters));
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
        edit={this.edit}
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
