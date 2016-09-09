'use strict';

import React, { Component } from 'react';

import EDITOR_CONTENT from 'content/editor/en-us.json';
import { renderList } from 'lib/utils';
import SidebarItem from '../SidebarItem';
import Adjust from './Adjust';

const CONTENT = EDITOR_CONTENT.EDIT_PANEL.ADJUST;

if (process.env.BROWSER) {
  require('./EditItemAdjust.css');
}

const propTypes = {
};

const defaultProps = {
};

class EditItemAdjust extends Component {
  constructor(props) {
    super(props);
  }

  // Render list of adjustments
  renderAdjustList(propsList) {
    return renderList(propsList, (props, idx) => <Adjust key={`${idx}${props.title}`} {...props} />);
  }

  render() {
    const adjustListProps = [{
      title: CONTENT.BRIGHTNESS,
      min: -100,
      max: 100,
      initialValue: 0
    }, {
      title: CONTENT.CONTRAST,
      min: -100,
      max: 100,
      initialValue: 0
    }, {
      title: CONTENT.SATURATION,
      min: -100,
      max: 100,
      initialValue: 0
    }];
    const adjustList = this.renderAdjustList(adjustListProps);

    return (
      <div className="edit-item-adjust-component">
        <SidebarItem
          icon="adjust"
          title={CONTENT.TITLE}
        >
          {adjustList}
        </SidebarItem>
      </div>
    );
  }
}

EditItemAdjust.propTypes = propTypes;
EditItemAdjust.defaultProps = defaultProps;

export default EditItemAdjust;
