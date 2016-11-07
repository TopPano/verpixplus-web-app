'use strict';

import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

import { MODE } from 'constants/editor';
import EDITOR_CONTENT from 'content/editor/en-us.json';
import Modal from 'components/Common/Modal';
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
  lower: PropTypes.number.isRequired,
  upper: PropTypes.number.isRequired,
  autoplay: PropTypes.bool.isRequired,
  filters: PropTypes.object.isRequired,
  isProcessing: PropTypes.bool.isRequired,
  playerSetAutoplay: PropTypes.func.isRequired,
  create: PropTypes.func.isRequired,
  update: PropTypes.func.isRequired
};

const defaultProps = {
};

class EditItemSettings extends Component {
  constructor(props) {
    super(props);

    // Bind "this" to memeber functions
    this.createMedia = this.createMedia.bind(this);
    this.updateMedia = this.updateMedia.bind(this);
    this.handleChangeAutoplay = this.handleChangeAutoplay.bind(this);
    this.handleClickSave = this.handleClickSave.bind(this);
  }

  // Wrapper for creating media
  createMedia() {
    const {
      mediaType,
      title,
      caption,
      appliedData,
      dimension,
      lower,
      upper,
      create
    } = this.props;

    create({
      mediaType,
      title,
      caption,
      data: appliedData.slice(lower, upper),
      dimension
    });
  }

  // Wrapper for updating media
  updateMedia() {
    const {
      mediaId,
      title,
      caption,
      update
    } = this.props;

    update({
      mediaId,
      title,
      caption
    })
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
      filters
    } = this.props;

    if (mode === MODE.CREATE) {
      if (filters.isDirty) {
        this.refs.warnModal.open();
      } else {
        this.createMedia();
      }
    } else if (mode === MODE.EDIT) {
      this.updateMedia();
    }
  }

  render() {
    const {
      mode,
      mediaId,
      autoplay,
      filters,
      isProcessing
    } = this.props;
    const saveBtnProps = {
      className: classNames({
        'btn btn-u text-uppercase rounded margin-right-10': true,
        'btn-u-orange': filters.isDirty
      }),
      icon: 'floppy-o',
      text: mode === MODE.WAIT_FILE || mode === MODE.CREATE ? CONTENT.POST :
            mode === MODE.EDIT ? CONTENT.UPDATE :
            '',
      disabled: mode !== MODE.CREATE && mode !== MODE.EDIT,
      handleClick: this.handleClickSave
    }
    const warnModalProps = {
      ref: 'warnModal',
      title: CONTENT.WARN_MODAL.TITLE,
      confirmBtn: {
        icon: 'floppy-o',
        className: 'btn btn-u text-uppercase pull-right rounded',
        text: CONTENT.POST,
        onClick: () => {
          this.refs.warnModal.close();
          this.createMedia();
        }
      },
      closeBtn: {
        className: 'btn btn-u btn-u-default text-uppercase pull-left rounded',
        text: CONTENT.CANCEL
      }
    };

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
        <Modal {...warnModalProps}>
          <div>{CONTENT.WARN_MODAL.DESC}</div>
        </Modal>
      </div>
    );
  }
}

EditItemSettings.propTypes = propTypes;
EditItemSettings.defaultProps = defaultProps;

export default EditItemSettings;
