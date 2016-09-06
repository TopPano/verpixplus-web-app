'use strict';

import React, { Component, PropTypes } from 'react';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';

import { MODE } from 'constants/editor';
import FileLoader from './FileLoader';
import Sidebar from './Sidebar';

if (process.env.BROWSER) {
  require('./Editor.css');
}

const propTypes = {
  mode: PropTypes.string.isRequired,
  postId: PropTypes.string
};

const defaultProps = {
  postId: ''
};

class Editor extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { mode } = this.props;

    if (mode === MODE.UPLOAD) {
      // Upload mode
    } else if (mode === MODE.EDIT) {
      // Edit mode
    } else  {
      // TODO: any other case ?
    }

    return (
      <div className="editor-component container-full">
        <Row className="fill">
          <Col md={9} sm={8} className="editor-main">
            <FileLoader />
          </Col>
          <Col md={3} sm={4} className="editor-sidebar">
            <Sidebar />
          </Col>
        </Row>
      </div>
    );
  }
}

Editor.propTypes = propTypes;
Editor.defaultProps = defaultProps;

export default Editor;
