import isFunction from 'lodash/isFunction';

export default function execute(callback, ...args) {
  if (isFunction(callback)) {
    callback(...args);
  }
}
