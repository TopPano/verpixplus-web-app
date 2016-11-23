import {
  SUPPORTED_LOCALES,
  DEFAULT_LOCALE
} from 'constants/common';

export default function detectLocale(req) {
  // Take locale by passing request
  const passedLocale = (req.query.locale || req.cookies.locale || '').toLowerCase();

  if (SUPPORTED_LOCALES.indexOf(passedLocale) >= 0) {
    return passedLocale;
  }

  return DEFAULT_LOCALE;
}
