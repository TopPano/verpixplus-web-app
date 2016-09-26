import React from 'react';
import Promise from 'lib/utils/promise';

export default function connectDataFetchers(Component, actionCreators) {
  return class DataFetchersWrapper extends React.Component {
    static propTypes = {
      dispatch: React.PropTypes.func.isRequired,
      params: React.PropTypes.object.isRequired,
      location: React.PropTypes.object.isRequired
    };

    static fetchData(dispatch, params = {}, location = {}, authToken = null) {
      return Promise.all(
        actionCreators.map(actionCreator => dispatch(actionCreator({ params, location, authToken })))
      );
    }

    componentDidMount() {
      DataFetchersWrapper.fetchData(
        this.props.dispatch,
        this.props.params,
        this.props.location,
        this.props.authToken
      );
    }

    render() {
      return (
        <Component {...this.props} />
      );
    }
  };
}
