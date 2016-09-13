import { push } from 'react-router-redux';
import startsWith from 'lodash/startsWith';

import FrameConverter from './FrameConverter';
import { MEDIA_TYPE } from 'constants/common';

export const INIT_UPLOAD = 'INIT_UPLOAD';
export const INIT_EDIT = 'INIT_EDIT';

// Initialize editor state
export function initEditor({ params = {}, location = {} }) {
  return (dispatch) => {
    if (startsWith(location.pathname, '/upload')) {
      // Upload
      dispatch({
        type: INIT_UPLOAD
      });
    } else if (startsWith(location.pathname, '/edit')){
      // Edit
      // TODO: Handle Edit mode
      dispatch({
        type: INIT_EDIT,
        postId: params.postId
      });
    } else {
      // Other cases, redirect to home page
      dispatch(push('/'));
    }
  };
}

export const CONVERT_REQUEST = 'CONVERT_REQUEST';
export const CONVERT_PROGRESS = 'CONVERT_PROGRESS';
export const CONVERT_SUCCESS = 'CONVERT_SUCCESS';
export const CONVERT_FAILURE = 'CONVERT_FAILURE';

function convertRequest() {
  return {
    type: CONVERT_REQUEST
  };
}

function convertProgress(progress) {
  return {
    type: CONVERT_PROGRESS,
    progress
  };
}

function convertSuccess(result) {
  return {
    type: CONVERT_SUCCESS,
    result
  };
}

function convertFailure(errMsg) {
  return {
    type: CONVERT_REQUEST,
    errMsg
  };
}

export function convert({ mediaType, source }) {
  return (dispatch) => {
    if (mediaType === MEDIA_TYPE.LIVE_PHOTO) {
      dispatch(convertRequest(mediaType));

      new FrameConverter().convert(source, (progress) => {
        dispatch(convertProgress(progress));
      }).then((frames) => {
        dispatch(convertSuccess(frames));
      }).catch((errMsg) => {
        dispatch(convertFailure(errMsg));
      });
    } else if (mediaType === MEDIA_TYPE.PANO_PHOTO) {
      // TODO: Handle panophoto
    } else {
      dispatch(convertFailure(`Meida type: ${mediaType} is not supported`));
    }

  };
}
