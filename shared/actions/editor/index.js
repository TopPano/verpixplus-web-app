import { push } from 'react-router-redux';
import isString from 'lodash/isString';
import startsWith from 'lodash/startsWith';
import merge from 'lodash/merge';

import api from 'lib/api';
import { MEDIA_TYPE } from 'constants/common';
import { getMedia } from '../media';
import imageUrlsToData from './imageUrlsToData';
import FrameConverter from './FrameConverter';
import concatImages from './concatImages';

export const INIT_UPLOAD = 'INIT_UPLOAD';
export const INIT_EDIT = 'INIT_EDIT';

// Filter function for getMedia.
// Used to construct images RGBA data from image URLs.
function constructImagesData(res) {
  const { imgUrls, dimension } = res.result;

  return imageUrlsToData(imgUrls, dimension).then((imgsData) => {
    return merge({}, res, {
      result: {
        imgsData
      }
    });
  });
}

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
      const mediaId = params.mediaId;

      dispatch({
        type: INIT_EDIT,
        mediaId: params.mediaId
      });

      dispatch(getMedia({
        mediaId,
        filter: constructImagesData
      }));
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

export const EDIT_TITLE = 'EDIT_TITLE';
export const EDIT_CAPTION = 'EDIT_CAPTION';

function editTitle(title) {
  return {
    type: EDIT_TITLE,
    title
  };
}

function editCaption(caption) {
  return {
    type: EDIT_CAPTION,
    caption
  };
}

export function edit({ title, caption }) {
  return (dispatch) => {
    if (isString(title)) {
      dispatch(editTitle(title));
    }

    if (isString(caption)) {
      dispatch(editCaption(caption));
    }
  }
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

export function createMedia({ mediaType, title, caption, data, dimension }) {
  return (dispatch) => {
    if (mediaType === MEDIA_TYPE.LIVE_PHOTO) {
      dispatch(createMediaRequest());

      // TODO: dynamically choose thumbnail index
      concatImages(data).then((concatImgs) => {
        const formData = new FormData();

        // TODO: dynamically value for action and orientation
        formData.append('title', title);
        formData.append('caption', caption);
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
