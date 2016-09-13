'use strict';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { connectDataFetchers } from 'lib/utils';
import {
  initEditor,
  convert
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

    // Bind "this" to member function
    this.convertFile = this.convertFile.bind(this);
  }

  convertFile({ mediaType, source }) {
    this.props.dispatch(convert({ mediaType, source }));
  }

  render() {
    const { editor } = this.props;

    return (
      <Editor
        {...editor}
        convertFile={this.convertFile}
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
