import humanizeDuration from 'humanize-duration';

import CONTENT from 'content/common/en-us.json';

const { READABLE_DURATION } = CONTENT;

// TODO:
// 1. Support multiple languages
// 2. For duration larger than 1 year, return date format instead of duration
export default function getReadableDuration(date) {
  if (!date) {
    return '';
  } else {
    const duration = humanizeDuration(new Date() - new Date(date));
    const primaryDuration = duration.split(',')[0];

    if (primaryDuration.includes('seconds') && parseInt(primaryDuration, 10) < 10) {
      // if duration is less than 10 seconds, return "just now"
      return READABLE_DURATION.JUST_NOW;
    } else {
      return `${primaryDuration} ${READABLE_DURATION.AGO}`;
    }

  }
}
