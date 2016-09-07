'use strict';

import React, { Component } from 'react';

import EDITOR_CONTENT from 'content/editor/en-us.json';
import IconButton from 'components/Common/IconButton';
import EditItem from './EditItem';

const CONTENT = EDITOR_CONTENT.EDIT_PANEL.SETTINGS;

if (process.env.BROWSER) {
  require('./EditItemSettings.css');
}

const propTypes = {
};

const defaultProps = {
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
    // TODO: Implement this function
  }

  // Handler for clicking delete button
  handleClickDelete() {
    // TODO: Implement this function
  }

  render() {
    return (
      <div className="edit-item-settings-component">
        <EditItem
          icon="cog"
          title={CONTENT.TITLE}
        >
          <IconButton
            className="btn-u text-uppercase margin-right-10"
            icon="floppy-o"
            text={CONTENT.SAVE}
            handleClick={this.handleClickSave}
          />
          <IconButton
            className="btn-u btn-u-red text-uppercase"
            icon="trash-o"
            text={CONTENT.DELETE}
            handleClick={this.handleClickDelete}
          />
        </EditItem>
      </div>
    );
  }
}

EditItemSettings.propTypes = propTypes;
EditItemSettings.defaultProps = defaultProps;

export default EditItemSettings;
