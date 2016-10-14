'use strict';

import React, { Component, PropTypes } from 'react';

import { MODE } from 'constants/editor';
import EDITOR_CONTENT from 'content/editor/en-us.json';
import DeleteModal from 'containers/common/DeleteModal';
import IconButton from 'components/Common/IconButton';
import SwitchButton from 'components/Common/SwitchButton';
import SidebarItem from '../SidebarItem';

const CONTENT = EDITOR_CONTENT.EDIT_PANEL.SETTINGS;

if (process.env.BROWSER) {
  require('./EditItemSettings.css');
}

const propTypes = {
  mode: PropTypes.string.isRequired,
  mediaId: PropTypes.string.isRequired,
  mediaType: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  caption: PropTypes.string.isRequired,
  appliedData: PropTypes.arrayOf(PropTypes.object).isRequired,
  dimension: PropTypes.shape({
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired
  }).isRequired,
  autoplay: PropTypes.bool.isRequired,
  isProcessing: PropTypes.bool.isRequired,
  playerSetAutoplay: PropTypes.func.isRequired,
  create: PropTypes.func.isRequired
};

const defaultProps = {
};

class EditItemSettings extends Component {
  constructor(props) {
    super(props);

    // Bind "this" to memeber functions
    this.handleChangeAutoplay = this.handleChangeAutoplay.bind(this);
    this.handleClickSave = this.handleClickSave.bind(this);
  }

  // Handler for changing autoplay setting
  handleChangeAutoplay() {
    const {
      autoplay,
      playerSetAutoplay
    } = this.props;

    playerSetAutoplay(!autoplay);
  }

  // Handler for clicking save button
  handleClickSave() {
    const {
      mode,
      mediaType,
      title,
      caption,
      appliedData,
      dimension,
      create
    } = this.props;

    if (mode === MODE.CREATE) {
      create({
        mediaType,
        title,
        caption,
        data: appliedData,
        dimension
      });
    } else if (mode === MODE.EDIT) {
      // TODO: handle EDIT mode
    }
  }

  render() {
    const {
      mode,
      mediaId,
      autoplay,
      isProcessing
    } = this.props;
    const saveBtnProps = {
      className: 'btn btn-u text-uppercase rounded margin-right-10',
      icon: 'floppy-o',
      text: mode === MODE.WAIT_FILE || mode === MODE.CREATE ? CONTENT.POST :
            mode === MODE.EDIT ? CONTENT.UPDATE :
            '',
      disabled: mode !== MODE.CREATE && mode !== MODE.EDIT,
      handleClick: this.handleClickSave
    }

    return (
      <div className="edit-item-settings-component">
        <SidebarItem
          icon="cog"
          title={CONTENT.TITLE}
        >
          <div className="autoplay panel-heading overflow-h">
            <h5 className="panel-title heading-sm pull-left">
              {CONTENT.AUTOPLAY}
            </h5>
            <SwitchButton
              className="pull-right"
              checked={autoplay}
              onChange={this.handleChangeAutoplay}
            />
          </div>
          <div className="margin-bottom-20" />
          <div className="btns-wrapper">
            <IconButton {...saveBtnProps} />
            {
              mode === MODE.EDIT &&
              <DeleteModal
                mediaId={mediaId}
                isProcessing={isProcessing}
              >
                <IconButton
                  className="btn btn-u btn-u-red text-uppercase rounded"
                  icon="trash-o"
                  text={CONTENT.DELETE}
                />
              </DeleteModal>
            }
          </div>
        </SidebarItem>
      </div>
    );
  }
}

EditItemSettings.propTypes = propTypes;
EditItemSettings.defaultProps = defaultProps;

export default EditItemSettings;
