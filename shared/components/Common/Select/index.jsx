'use strict';

import React, { Component } from 'react';
import omit from 'lodash/omit';
import ReactSelect from 'react-select';

import IconValue from './IconValue';
import IconSelectControl from './IconSelectControl';

if (process.env.BROWSER) {
  require('./Select.css')
  require('react-select/dist/react-select.css');
}

const propTypes = {
};

const defaultProps = {
};

class Select extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const selectClass = `select-component ${this.props.className}`;

    return (
      <ReactSelect
        className={selectClass}
        valueComponent={IconValue}
        optionComponent={IconSelectControl}
        {...omit(this.props, 'className')}
      />
    );
  }
}

Select.propTypes = propTypes;
Select.defaultProps = defaultProps;

export default Select;
