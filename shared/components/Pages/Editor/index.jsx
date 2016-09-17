'use strict';

import React, { Component, PropTypes } from 'react';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';

import { MODE } from 'constants/editor';
import FilePanel from './FilePanel';
import PlayerPanel from './PlayerPanel';
import FramePanel from './FramePanel';
import Sidebar from './Sidebar';

if (process.env.BROWSER) {
  require('./Editor.css');
}

const propTypes = {
  mode: PropTypes.string.isRequired,
  mediaType: PropTypes.string.isRequired,
  isProcessing: PropTypes.bool.isRequired,
  progress: PropTypes.number.isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  dataUrls: PropTypes.arrayOf(PropTypes.string).isRequired,
  dimension: PropTypes.shape({
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired
  }).isRequired,
  convertFile: PropTypes.func.isRequired,
  create: PropTypes.func.isRequired
};

const defaultProps = {
};

class Editor extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      mode,
      mediaType,
      isProcessing,
      progress,
      data,
      dataUrls,
      dimension,
      convertFile,
      create
    } = this.props;
    let mainComponent;

    if (mode === MODE.WAIT_FILE) {
      // Wait for user to choose file
      const filePanelProps = {
        isProcessing,
        progress,
        convertFile
      };
      mainComponent =
        <FilePanel {...filePanelProps} />;
    } else if (mode === MODE.CREATE) {
      // After choosing file, creates a new post
      mainComponent =
        <div className="main-wrapper fill">
          <PlayerPanel />
          <FramePanel
            images={dataUrls}
            dimension={dimension}
          />
        </div>
    } else if (mode === MODE.EDIT) {
      // Edit an old post
      mainComponent =
        <div className="main-wrapper fill">
          <PlayerPanel />
          <FramePanel
            images={dataUrls}
            dimension={dimension}
          />
        </div>
    } else  {
      // TODO: any other case ?
    }

    return (
      <div className="editor-component container-full">
        <Row className="fill">
          <Col md={9} sm={8} className="editor-main">
            {mainComponent}
          </Col>
          <Col md={3} sm={4} className="editor-sidebar">
            <Sidebar
              mediaType={mediaType}
              data={data}
              dimension={dimension}
              create={create}
            />
          </Col>
        </Row>
      </div>
    );
  }
}

Editor.propTypes = propTypes;
Editor.defaultProps = defaultProps;

export default Editor;
