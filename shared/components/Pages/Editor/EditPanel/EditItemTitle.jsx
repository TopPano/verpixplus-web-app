'use strict';

import React, { Component, PropTypes } from 'react';

import SidebarItem from '../SidebarItem';

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
  static contextTypes = { i18n: PropTypes.object };

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
    const { l } = this.context.i18n;
    const { title } = this.props;

    return (
      <div className="edit-item-title-component">
        <SidebarItem>
          <input
            type="text"
            ref="titleInput"
            className="form-control"
            placeholder={l('Title')}
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
