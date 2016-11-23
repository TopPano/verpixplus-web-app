import merge from 'lodash/merge';

export default function genErr(message, others) {
  return merge({}, { message }, others);
}
