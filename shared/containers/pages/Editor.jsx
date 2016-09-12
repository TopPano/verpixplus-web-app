'use strict';

import React, { Component } from 'react';
import startsWith from 'lodash/startsWith';

import { MODE } from 'constants/editor';
import Editor from 'components/Pages/Editor';

const propTypes = {
};

const defaultProps = {
};

class EditorPageContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { location, params } = this.props;
    let editorProps = {};

    if (startsWith(location.pathname, '/upload')) {
      editorProps = {
        mode: MODE.UPLOAD
      };
    } else if (startsWith(location.pathname, '/edit')){
      editorProps = {
        mode: MODE.EDIT,
        postId: params.postId
      };
    } else {
      // TODO: any other case ?
    }

    return (
      <Editor {...editorProps} >
        {this.props.children}
      </Editor>
    );
  }
}

EditorPageContainer.propTypes = propTypes;
EditorPageContainer.defaultProps = defaultProps;

export default EditorPageContainer;
