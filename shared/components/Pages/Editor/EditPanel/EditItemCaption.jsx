'use strict';

import React, { Component, PropTypes } from 'react';

import SidebarItem from '../SidebarItem';

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
  static contextTypes = { i18n: PropTypes.object };

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
    const { l } = this.context.i18n;
    const { caption } = this.props;

    return (
      <div className="edit-item-caption-component">
        <SidebarItem>
          <textarea
            ref="captionInput"
            className="form-control"
            rows="5"
            placeholder={l('Description')}
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
