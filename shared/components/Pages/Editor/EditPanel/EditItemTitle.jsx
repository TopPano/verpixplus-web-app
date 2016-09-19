'use strict';

import React, { Component, PropTypes } from 'react';

import SidebarItem from '../SidebarItem';
import EDITOR_CONTENT from 'content/editor/en-us.json';

const CONTENT = EDITOR_CONTENT.EDIT_PANEL.TITLE;

if (process.env.BROWSER) {
  require('./EditItemTitle.css');
}

const propTypes = {
  title: PropTypes.string.isRequired,
  edit: PropTypes.func.isRequired
};

const defaultProps = {
};

class EditItemTitle extends Component {
  constructor(props) {
    super(props);

    // Bind "this" to member functinos
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange() {
    const titleVal = this.refs.titleInput.value;

    this.props.edit({
      title: titleVal
    });
  }

  render() {
    const { title } = this.props;

    return (
      <div className="edit-item-title-component">
        <SidebarItem
          icon="info-circle"
          title={CONTENT.TITLE}
        >
          <input
            type="text"
            ref="titleInput"
            className="form-control bg-color-light-grey"
            placeholder={CONTENT.PLACE_HOLDER}
            value={title}
            onChange={this.handleChange}
          />
        </SidebarItem>
      </div>
    );
  }
}

EditItemTitle.propTypes = propTypes;
EditItemTitle.defaultProps = defaultProps;

export default EditItemTitle;
