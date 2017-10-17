import React from 'react';

import { DEFAULT_LOCALE } from 'constants/common';
import Promise from 'lib/utils/promise';

export default function connectDataFetchers(Component, actionCreators) {
  return class DataFetchersWrapper extends React.Component {
    static contextTypes = {
      i18n: React.PropTypes.object
    };

    static propTypes = {
      dispatch    : React.PropTypes.func.isRequired,
      params      : React.PropTypes.object.isRequired,
      location    : React.PropTypes.shape({
        pathname  : React.PropTypes.string.required,
        search    : React.PropTypes.string,
        query     : React.PropTypes.string.object
      }).isRequired,
      userSession : React.PropTypes.object
    };

    static fetchData({ dispatch, params = {}, location = {}, userSession = {}, locale }) {
      return Promise.all(
        actionCreators.map(actionCreator => dispatch(actionCreator({ params, location, userSession, locale })))
      );
    }

    componentDidMount() {
      const locale = this.context.i18n ? this.context.i18n.getLocale() : DEFAULT_LOCALE;

      DataFetchersWrapper.fetchData({
        dispatch    : this.props.dispatch,
        params      : this.props.params,
        location    : this.props.location,
        userSession : this.props.user,
        locale
      });
    }

    render() {
      return (
        <Component {...this.props} />
      );
    }
  };
}
