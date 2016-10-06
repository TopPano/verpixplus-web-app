'use strict';

import React, { Component, PropTypes } from 'react';

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
  title: PropTypes.string.isRequired,
  caption: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  appliedData: PropTypes.arrayOf(PropTypes.object).isRequired,
  dataUrls: PropTypes.arrayOf(PropTypes.string).isRequired,
  dimension: PropTypes.shape({
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired
  }).isRequired,
  playerMode: PropTypes.string.isRequired,
  autoplay: PropTypes.bool.isRequired,
  lower: PropTypes.number.isRequired,
  upper: PropTypes.number.isRequired,
  filters: PropTypes.object.isRequired,
  convertFile: PropTypes.func.isRequired,
  playerPlay: PropTypes.func.isRequired,
  playerPause: PropTypes.func.isRequired,
  playerSetAutoplay: PropTypes.func.isRequired,
  trim: PropTypes.func.isRequired,
  edit: PropTypes.func.isRequired,
  adjustFilters: PropTypes.func.isRequired,
  applyFilters: PropTypes.func.isRequired,
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
      title,
      caption,
      data,
      appliedData,
      dataUrls,
      dimension,
      autoplay,
      playerMode,
      lower,
      upper,
      filters,
      convertFile,
      playerPlay,
      playerPause,
      playerSetAutoplay,
      trim,
      edit,
      adjustFilters,
      applyFilters,
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
    } else if (mode === MODE.CREATE || mode === MODE.EDIT) {
      // CREATE mode: after choosing file, creates a new media
      // EDIT mode: edit an old media
      mainComponent =
        <div className="main-wrapper fill">
          <PlayerPanel
            imagesData={data}
            appliedImagesData={appliedData}
            dimension={dimension}
            playerMode={playerMode}
            autoplay={autoplay}
            lower={lower}
            upper={upper}
            filters={filters}
          />
          <FramePanel
            images={dataUrls}
            dimension={dimension}
            lower={lower}
            upper={upper}
            playerPlay={playerPlay}
            playerPause={playerPause}
            trim={trim}
          />
        </div>
    } else  {
      // TODO: any other case ?
    }

    return (
      <div className="editor-component container-full">
        <div className="editor-main">
          {mainComponent}
        </div>
        <div className="editor-sidebar">
          <Sidebar
            mode={mode}
            mediaType={mediaType}
            title={title}
            caption={caption}
            data={data}
            appliedData={appliedData}
            dimension={dimension}
            autoplay={autoplay}
            filters={filters}
            playerPlay={playerPlay}
            playerPause={playerPause}
            playerSetAutoplay={playerSetAutoplay}
            edit={edit}
            adjustFilters={adjustFilters}
            applyFilters={applyFilters}
            create={create}
          />
        </div>
      </div>
    );
  }
}

Editor.propTypes = propTypes;
Editor.defaultProps = defaultProps;

export default Editor;
