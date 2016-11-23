import Promise from 'lib/utils/promise';

export default function fetchComponentsData({ dispatch, components, params, location, userSession, locale }) {
  const promises = components.map(current => {
    const component = current.WrappedComponent ? current.WrappedComponent : current;

    return component.fetchData
      ? component.fetchData({ dispatch, params, location, userSession, locale })
      : null;
  });

  return Promise.all(promises);
}
