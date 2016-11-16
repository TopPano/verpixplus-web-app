'use strict';

import React, { Component, PropTypes } from 'react';

import SidebarItem from '../SidebarItem';
import EDITOR_CONTENT from 'content/editor/en-us.json';

const CONTENT = EDITOR_CONTENT.EDIT_PANEL.CAPTION;

if (process.env.BROWSER) {
  require('./EditItemCaption.css');
}

const propTypes = {
  caption: PropTypes.string.isRequired,
  edit: PropTypes.func.isRequired
};

const defaultProps = {
};

class EditItemCaption extends Component {
  constructor(props) {
    super(props);

    // Bind "this" to member functinos
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange() {
    const captionVal = this.refs.captionInput.value;

    this.props.edit({
      caption: captionVal
    });
  }

  render() {
    const { caption } = this.props;
    return (
      <div className="edit-item-caption-component">
        <SidebarItem>
          <textarea
            ref="captionInput"
            className="form-control"
            rows="5"
            placeholder={CONTENT.PLACE_HOLDER}
            value={caption}
            onChange={this.handleChange}
          />
        </SidebarItem>
      </div>
    );
  }
}

EditItemCaption.propTypes = propTypes;
EditItemCaption.defaultProps = defaultProps;

export default EditItemCaption;
