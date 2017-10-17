'use strict';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import {
  imagesStorage,
  connectDataFetchers
} from 'lib/utils';
import {
  initEditor,
  clearEditorErr
} from 'actions/editor';
import Editor from 'components/Pages/Editor';

const propTypes = {
  editor: PropTypes.object.isRequired
};

const defaultProps = {
};

class EditorPageContainer extends Component {
  constructor(props) {
    super(props);

    // Bind "this" to member functions
    this.clearErr = this.clearErr.bind(this);
  }

  // Wrapper function for dispatching clearEditorErr,
  // which clears the error of editor state
  clearErr() {
    this.props.dispatch(clearEditorErr());
  }

  componentWillUnmount() {
    const {
      storageId,
      converter
    } = this.props.editor;

    if (storageId) {
      imagesStorage.clear(storageId);
    }

    if (converter && converter.isConverting) {
      converter.stop();
    }
  }

  render() {
    const { editor } = this.props;

    return (
      <Editor
        {...editor}
        clearErr={this.clearErr}
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
