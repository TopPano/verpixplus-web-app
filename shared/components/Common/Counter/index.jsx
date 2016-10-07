'use strict'

import React, { Component, PropTypes } from 'react';

if (process.env.BROWSER) {
  require('./Counter.css');
}

const propTypes = {
  icon: PropTypes.string.isRequired,
  iconPosition: PropTypes.string,
  count: PropTypes.number
};

const defaultProps = {
  icon: '',
  iconPosition: '',
  count: 0
};

class Counter extends Component {
  render() {
    const { icon, iconPosition, count } = this.props

    return (
      <div className={ 'counter-component' + (iconPosition === 'counter-right' ? ' counter-right' : '') }>
        <div>
          <div className='counter-icon-wrapper'>
            <img className='counter-icon' src={icon}/>
          </div>
          <div className='counter-count'>{count}</div>
        </div>
      </div>
    );
  }
}

Counter.propTypes = propTypes;
Counter.defaultProps = defaultProps;

export default Counter;
