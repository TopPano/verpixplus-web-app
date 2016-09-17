'use strict';

import React, { Component, PropTypes } from 'react';

import EDITOR_CONTENT from 'content/editor/en-us.json';
import IconButton from 'components/Common/IconButton';
import SidebarItem from '../SidebarItem';

const CONTENT = EDITOR_CONTENT.EDIT_PANEL.SETTINGS;

if (process.env.BROWSER) {
  require('./EditItemSettings.css');
}

const propTypes = {
  mediaType: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  dimension: PropTypes.shape({
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired
  }).isRequired,
  create: PropTypes.func.isRequired
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
    const {
      mediaType,
      data,
      dimension,
      create
    } = this.props;

    create({
      mediaType,
      data,
      dimension
    });
  }

  // Handler for clicking delete button
  handleClickDelete() {
    // TODO: Implement this function
  }

  render() {
    return (
      <div className="edit-item-settings-component">
        <SidebarItem
          icon="cog"
          title={CONTENT.TITLE}
        >
          <IconButton
            className="btn-u text-uppercase rounded margin-right-10"
            icon="floppy-o"
            text={CONTENT.SAVE}
            handleClick={this.handleClickSave}
          />
          <IconButton
            className="btn-u btn-u-red text-uppercase rounded"
            icon="trash-o"
            text={CONTENT.DELETE}
            handleClick={this.handleClickDelete}
          />
        </SidebarItem>
      </div>
    );
  }
}

EditItemSettings.propTypes = propTypes;
EditItemSettings.defaultProps = defaultProps;

export default EditItemSettings;
