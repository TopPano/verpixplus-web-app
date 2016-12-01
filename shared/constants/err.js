const ERR = {
  // Error messages about signin/signup/reset password/change password
  USERNAME_REGISTERED: 'The username is already registered, please try another username',
  EMAIL_REGISTERED: 'The email address is already registered, please try another addresss',
  EMAIL_NOT_FOUND: 'The email address is not registered, please sign in with another address',
  LOGIN_FAILED: 'The email and password don\'t match',
  WRONG_OLD_PASSWD: 'Your old password is not correct',

  // Error messages of fetch
  // XXX: Is there any other reason will result in 'Failed to fetch' message ?
  'Failed to fetch': 'Network is disconnected, please ensure your device is connected to network',
  FETCH_DEFAULT: 'Something wrong with server, please try again later',

  // Error messages about editor
  NO_VIDEO_SPECIFIED: 'Please select a video to upload',
  EXCEED_VIDEO_TIME_LIMIT: 'The total time of video exceeds the limit',
  VIDEO_FORMAT_NOT_SUPPORTED: 'The video format is not supported, please upload another video',
  VIDEO_IS_CONVERTING: 'Video is converting, please try again later',
  MEDIA_NOT_SUPPORTED: 'Non-support media type',

  // Default error message
  DEFAULT: 'Something error, please try again later'
};

export default ERR;
