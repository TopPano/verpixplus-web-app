import { push } from 'react-router-redux';
import startsWith from 'lodash/startsWith';

import api from 'lib/api';
import FrameConverter from './FrameConverter';
import concatImages from './concatImages';
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
        mediaId: params.mediaId
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

function convertSuccess(mediaType, result) {
  return {
    type: CONVERT_SUCCESS,
    mediaType,
    result
  };
}

function convertFailure(err) {
  return {
    type: CONVERT_REQUEST,
    err
  };
}

export function convert({ mediaType, source }) {
  return (dispatch) => {
    if (mediaType === MEDIA_TYPE.LIVE_PHOTO) {
      dispatch(convertRequest(mediaType));

      new FrameConverter().convert(source, (progress) => {
        dispatch(convertProgress(progress));
      }).then((result) => {
        dispatch(convertSuccess(mediaType, result));
      }).catch((message) => {
        dispatch(convertFailure({ message }));
      });
    } else if (mediaType === MEDIA_TYPE.PANO_PHOTO) {
      // TODO: Handle panophoto
    } else {
      dispatch(convertFailure({
        message: `Meida type: ${mediaType} is not supported`
      }));
    }
  };
}

export const CREATE_MEDIA_REQUEST = 'CREATE_MEDIA_REQUEST';
export const CREATE_MEDIA_PROGRESS = 'CREATE_MEDIA_PROGRESS';
export const CREATE_MEDIA_SUCCESS = 'CREATE_MEDIA_SUCCESS';
export const CREATE_MEDIA_FAILURE = 'CREATE_MEDIA_FAILURE';

function createMediaRequest() {
  return {
    type: CREATE_MEDIA_REQUEST
  };
}

function createMediaProgress(progress) {
  return {
    type: CREATE_MEDIA_PROGRESS,
    progress
  };
}

function createMediaSuccess(response) {
  return {
    type: CREATE_MEDIA_SUCCESS,
    response
  };
}

function createMediaFailure(err) {
  return {
    type: CREATE_MEDIA_FAILURE,
    err
  };
}

export function createMedia({ mediaType, data, dimension }) {
  return (dispatch) => {
    if (mediaType === MEDIA_TYPE.LIVE_PHOTO) {
      dispatch(createMediaRequest());

      // TODO: dynamically choose thumbnail index
      concatImages(data).then((concatImgs) => {
        const formData = new FormData();

        // TODO: dynamically value for caption, action and orientation
        formData.append('caption', '');
        formData.append('action', 'horizontal');
        formData.append('orientation', 'portrait');
        formData.append('width', dimension.width);
        formData.append('height', dimension.height);
        formData.append('imgArrBoundary', concatImgs.separator);
        formData.append('thumbnail', concatImgs.thumbnail);
        formData.append('image', concatImgs.zip);

        return api.media.postMedia(mediaType, formData);
      }).then((res) => {
        dispatch(createMediaSuccess(res));
      }).catch((err) => {
        dispatch(createMediaFailure(err));
      });
    } else if (mediaType === MEDIA_TYPE.PANO_PHOTO) {
      // TODO: Handle panophoto
    } else {
      dispatch(createMediaFailure({
        message: `Meida type: ${mediaType} is not supported`
      }));
    }
  };
}
