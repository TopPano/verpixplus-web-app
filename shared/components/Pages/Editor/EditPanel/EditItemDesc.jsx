'use strict';

import React, { Component } from 'react';

import EditItem from './EditItem';
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
        <EditItem
          icon="pencil"
          title={CONTENT.TITLE}
        >
          <textarea
            className="form-control bg-color-light-grey"
            rows="4"
            placeholder={CONTENT.PLACE_HOLDER}
          />
        </EditItem>
      </div>
    );
  }
}

EditItemDesc.propTypes = propTypes;
EditItemDesc.defaultProps = defaultProps;

export default EditItemDesc;
