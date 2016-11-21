'use strict';

import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

import { MODE } from 'constants/editor';
import EDITOR_CONTENT from 'content/editor/en-us.json';
import Modal from 'components/Common/Modal';
import DeleteModal from 'containers/common/DeleteModal';
import FlatButton from 'components/Common/FlatButton';
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
        'sidebar-btn': true,
        'dirty': filters.isDirty
      }),
      text: CONTENT.SAVE,
      disabled: mode !== MODE.CREATE && mode !== MODE.EDIT,
      onClick: this.handleClickSave
    }
    const warnModalProps = {
      ref: 'warnModal',
      title: CONTENT.WARN_MODAL.TITLE,
      confirmBtn: {
        text: CONTENT.SAVE,
        onClick: () => {
          this.refs.warnModal.close();
          this.createMedia();
        }
      },
      closeBtn: {
        text: CONTENT.CANCEL
      }
    };

    return (
      <div className="edit-item-settings-component">
        <SidebarItem>
          <div className="autoplay overflow-h">
            <SwitchButton
              checked={autoplay}
              onChange={this.handleChangeAutoplay}
            />
            <p className="">
              {CONTENT.AUTOPLAY}
            </p>
          </div>
          <div className="margin-bottom-60" />
          <div className="btns-wrapper">
            <FlatButton {...saveBtnProps} />
            {
              mode === MODE.EDIT &&
              <DeleteModal
                mediaId={mediaId}
                isProcessing={isProcessing}
              >
                <FlatButton
                  className="sidebar-btn"
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
