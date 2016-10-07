import { push } from 'react-router-redux';
import isString from 'lodash/isString';
import isNumber from 'lodash/isNumber';
import isBoolean from 'lodash/isBoolean';
import startsWith from 'lodash/startsWith';
import merge from 'lodash/merge';

import { MEDIA_TYPE } from 'constants/common';
import { getMedia } from '../media';
import imageUrlsToData from './imageUrlsToData';
import FrameConverter from './FrameConverter';

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

export const PLAYER_PLAY = 'PLAYER_PLAY';
export const PLAYER_PAUSE = 'PLAYER_PAUSE';
export const PLAYER_SET_AUTOPLAY = 'PLAYER_SET_AUTOPLAY';

export function playerPlay() {
  return (dispatch) => {
    dispatch({
      type: PLAYER_PLAY
    });
  };
}

export function playerPause() {
  return (dispatch) => {
    dispatch({
      type: PLAYER_PAUSE
    });
  };
}

export function playerSetAutoplay(autoplay) {
  return (dispatch) => {
    if (isBoolean(autoplay)) {
      dispatch({
        type: PLAYER_SET_AUTOPLAY,
        autoplay
      });
    }
  };
}

export const TRIM = 'TRIM';

export function trim({ lower, upper }) {
  return (dispatch) => {
    if (isNumber(lower) && isNumber(upper) && lower <= upper) {
      dispatch({
        type: TRIM,
        lower,
        upper
      });
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

export const APPLY_FILTERS = 'APPLY_FILTERS';

export function applyFilters(filters) {
  return (dispatch) => {
    dispatch({
      type: APPLY_FILTERS,
      filters
    });
  }
}
