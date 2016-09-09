'use strict';

import React, { Component } from 'react';

import SidebarItem from '../SidebarItem';
import EDITOR_CONTENT from 'content/editor/en-us.json';

const CONTENT = EDITOR_CONTENT.EDIT_PANEL.DESC;

if (process.env.BROWSER) {
  require('./EditItemDesc.css');
}

const propTypes = {
};

const defaultProps = {
};

class EditItemDesc extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="edit-item-desc-component">
        <SidebarItem
          icon="comment"
          title={CONTENT.TITLE}
        >
          <textarea
            className="form-control bg-color-light-grey"
            rows="4"
            placeholder={CONTENT.PLACE_HOLDER}
          />
        </SidebarItem>
      </div>
    );
  }
}

EditItemDesc.propTypes = propTypes;
EditItemDesc.defaultProps = defaultProps;

export default EditItemDesc;