import exterApiConfig from 'etc/external-api';

export function initialize() {
  if (process.env.NODE_ENV === 'production') {
    ga('create', exterApiConfig.ga.trackingCode, 'auto');
  }
}

export function navigate(pageData) {
  if (process.env.NODE_ENV === 'production') {
    ga('set', pageData);
    ga('send', 'pageview');
  }
}

export function sendEvent(category, action, label, value) {
  if (process.env.NODE_ENV === 'production') {
    ga('send', {
      hitType       : 'event',
      eventCategory : category,
      eventAction   : action,
      eventLabel    : label,
      eventValue    : value
    });
  }
}
