import isEmail from 'validator/lib/isEmail';
import isEmpty from 'is-empty';

import { sprintf } from 'lib/utils';
import { ACCOUNT_LIMIT } from 'constants/common';

const {
  USERNAME_MIN_LENGTH,
  USERNAME_MAX_LENGTH,
  PWD_MIN_LENGTH,
  PWD_MAX_LENGTH
} = ACCOUNT_LIMIT;

function testUsername (username, regExp) {
  const regex = new RegExp(regExp),
        result = regex.exec(username);
  return result && result[0] === username;
}

// Check username value
export function checkUsername (username, i18n) {
  const { l, nl } = i18n;

  // Check username is empty or not
  if (isEmpty(username)) {
    return l('Please enter username');
  }
  // Test username: only lowercase English letters, numbers, underscores and dots
  if (!testUsername(username, '[a-z0-9._]+')) {
    return (
      `${l('Please try another username')} ` +
      `(${l('Only lowercase English letters, numbers, underscores and dots can be used')})`
    );
  }
  // Test username: only lowercase English letters for first character
  if (!testUsername(username, '(?![0-9_.])[a-z0-9._]+')) {
    return (
      `${l('Please try another username')} ` +
      `(${l('The first character should be a lowercase English letter')})`
    );
  }
  // Test username: only lowercase English letters or number for last character
  if (!testUsername(username, '[a-z0-9._]+[a-z0-9]')) {
    return (
      `${l('Please try another username')} ` +
      `(${l('The last character should be a lowercase English letter or number')})`
    );
  }
  // Test username: no consecutive underscores or dots
  if (!testUsername(username, '(?!.*[_.]{2})[a-z0-9._]+')) {
    return (
      `${l('Please try another username')} ` +
      `(${l('No consecutive undersocres or dots')})`
    );
  }
  // Check length is longer than minimun length
  if (username.length < USERNAME_MIN_LENGTH) {
    return (
      `${l('Username is too short')} ` +
      `(${sprintf(nl('At least %d character', 'At least %d characters', USERNAME_MIN_LENGTH), USERNAME_MIN_LENGTH)})`
    );
  }
  // Check length is shorter than maximum length
  if (username.length > USERNAME_MAX_LENGTH) {
    return (
      `${l('Username is too long')} ` +
      `(${sprintf(nl('At most %d character', 'At most %d characters', USERNAME_MAX_LENGTH), USERNAME_MAX_LENGTH)})`
    );
  }

  return '';
}

// Check email value
export function checkEmail (email, i18n) {
  const { l } = i18n;

  // Check email is empty or not
  if (isEmpty(email)) {
    return l('Please enter your email');
  }
  // Email format validation
  if (!isEmail(email, { checkDNS: true })) {
    return l('The email address is not valid, please try another address');
  }

  return '';
}

// Check password value
export function checkPwd (pwd, i18n, pwdStr = 'password') {
  const { l, nl } = i18n;

  // Check password is empty or not
  if (isEmpty(pwd)) {
    return l(`Please enter your ${pwdStr}`);
  }
  // Check length is longer than minimun length
  if (pwd.length < PWD_MIN_LENGTH) {
    return (
      `${l('The ' + pwdStr + ' is too short')} ` +
      `(${sprintf(nl('At least %d character', 'At least %d characters', PWD_MIN_LENGTH), PWD_MIN_LENGTH)})`
    );
  }
  // Check length is shorter than maximun length
  if (pwd.length > PWD_MAX_LENGTH) {
    return (
      `${l('The ' + pwdStr + ' is too long')} ` +
      `(${sprintf(nl('At most %d character', 'At most %d characters', PWD_MAX_LENGTH), PWD_MAX_LENGTH)})`
    );
  }

  return '';
}


// Check password pair values
export function checkPwdPair (pwd, confirmPwd, i18n, pwdStr = 'password') {
  const { l } = i18n;
  const pwdErr = checkPwd(pwd, i18n, pwdStr);
  const confirmPwdErr = checkPwd(confirmPwd, i18n, `confirmed ${pwdStr}`);

  // Check password value
  if (pwdErr) {
    return {
      err: pwdErr
    };
  }
  // Check password value
  if (confirmPwdErr) {
    return {
      err: confirmPwdErr,
      isConfirm: true
    };
  }
  // Check equality of password and confirm-password
  if (pwd !== confirmPwd) {
    return {
      err: l('These passwords don\'t match'),
      isConfirm: true
    }
  }

  return {
    err: ''
  };
}
