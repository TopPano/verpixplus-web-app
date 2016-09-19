'use strict';

import React, { Component, PropTypes } from 'react';

import { MODE } from 'constants/editor';
import EDITOR_CONTENT from 'content/editor/en-us.json';
import IconButton from 'components/Common/IconButton';
import SidebarItem from '../SidebarItem';

const CONTENT = EDITOR_CONTENT.EDIT_PANEL.SETTINGS;

if (process.env.BROWSER) {
  require('./EditItemSettings.css');
}

const propTypes = {
  mode: PropTypes.string.isRequired,
  mediaType: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  caption: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  dimension: PropTypes.shape({
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired
  }).isRequired,
  disabled: PropTypes.bool,
  create: PropTypes.func.isRequired
};

const defaultProps = {
  disabled: false
};

class EditItemSettings extends Component {
  constructor(props) {
    super(props);

    // Bind "this" to memeber functions
    this.handleClickSave = this.handleClickSave.bind(this);
    this.handleClickDelete = this.handleClickDelete.bind(this);
  }

  // Handler for clicking save button
  handleClickSave() {
    const {
      mode,
      mediaType,
      title,
      caption,
      data,
      dimension,
      create
    } = this.props;

    if (mode === MODE.CREATE) {
      create({
        mediaType,
        title,
        caption,
        data,
        dimension
      });
    } else if (mode === MODE.EDIT) {
      // TODO: handle EDIT mode
    }
  }

  // Handler for clicking delete button
  handleClickDelete() {
    // TODO: Implement this function
  }

  render() {
    const {
      mode,
      disabled
    } = this.props;
    const saveBtnProps = {
      className: 'btn btn-u text-uppercase rounded margin-right-10',
      icon: 'floppy-o',
      text: mode === MODE.WAIT_FILE || mode === MODE.CREATE ? CONTENT.POST :
            mode === MODE.EDIT ? CONTENT.UPDATE :
            '',
      disabled,
      handleClick: this.handleClickSave
    }

    return (
      <div className="edit-item-settings-component">
        <SidebarItem
          icon="cog"
          title={CONTENT.TITLE}
        >
          <IconButton {...saveBtnProps} />
          {
            mode === MODE.EDIT &&
            <IconButton
              className="btn btn-u btn-u-red text-uppercase rounded"
              icon="trash-o"
              text={CONTENT.DELETE}
              handleClick={this.handleClickDelete}
            />
          }
        </SidebarItem>
      </div>
    );
  }
}

EditItemSettings.propTypes = propTypes;
EditItemSettings.defaultProps = defaultProps;

export default EditItemSettings;
