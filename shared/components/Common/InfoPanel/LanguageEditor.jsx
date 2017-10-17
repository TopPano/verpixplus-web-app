'use strict';

import React, { Component, PropTypes } from 'react';
import cookie from 'cookie';

import Select from 'components/Common/Select';
import {
  SUPPORTED_LOCALES,
  LOCALES_MAPPING
} from 'constants/common';

if (process.env.BROWSER) {
  require('./LanguageEditor.css');
}

const propTypes = {
};

const defaultProps = {
};

class LanguageEditor extends Component {
  static contextTypes = { i18n: PropTypes.object };

  constructor(props) {
    super(props);

    // Initialize state
    this.state = {
      open: false
    };

    // Bind "this" to member functions
    this.openSelect = this.openSelect.bind(this);
    this.closeSelect = this.closeSelect.bind(this);
    this.handleChangeLanguageOptions = this.handleChangeLanguageOptions.bind(this);
  }

  // Open the language select
  openSelect() {
    this.setState({
      open: true
    });
  }

  // Close the language select
  closeSelect() {
    this.setState({
      open: false
    });
  }

  // Handler for changing language options
  handleChangeLanguageOptions(options) {
    if (process.env.BROWSER) {
      if (options.value !== this.context.i18n.getLocale()) {
        // Set expires date as 2099/12/31, to make it persistant
        const expires = new Date(2099, 11, 31);
        document.cookie = cookie.serialize('locale', options.value, {
          path: '/',
          expires
        });
        window.location = window.location.href;
      }
    }
  }

  render() {
    const { l, getLocale } = this.context.i18n;
    const { open } = this.state;
    const languageOptions = SUPPORTED_LOCALES.map((locale) => ({
      value: locale,
      label: LOCALES_MAPPING[locale]
    }));

    return (
      <div className="language-editor-component">
        <div
          className="menu-link text-link small"
          onClick={this.openSelect}
        >
          {l('Language')}
        </div>
        {
          open &&
          <Select
            ref="select"
            name="language-select"
            className="language-select"
            value={getLocale()}
            options={languageOptions}
            searchable={false}
            clearable={false}
            autofocus={true}
            openOnFocus={true}
            onBlur={this.closeSelect}
            onChange={this.handleChangeLanguageOptions}
          />
        }
      </div>
    );
  }
}

LanguageEditor.propTypes = propTypes;
LanguageEditor.defaultProps = defaultProps;

export default LanguageEditor;
