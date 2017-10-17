import humanizeDuration from 'humanize-duration';

function getLanguage(locale) {
  if (locale === 'zh-tw') {
    return 'zh_TW';
  }

  return locale;
}

// TODO:
// For duration larger than 1 year, return date format instead of duration
export default function getReadableDuration(date, locale) {
  if (!date) {
    return '';
  } else {
    return humanizeDuration(new Date() - new Date(date), {
      language: getLanguage(locale)
    });
  }
}
