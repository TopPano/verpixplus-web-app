import api from 'lib/api';
import isFunction from 'lodash/isFunction';
import merge from 'lodash/merge';
import range from 'lodash/range';
import { push } from 'react-router-redux';

import { MEDIA_TYPE } from 'constants/common';
import { NOTIFICATIONS } from 'constants/notifications';
import concatImages from './concatImages';
import { pushNotification } from '../notifications';

function handleError(dispatch, type, err) {
  dispatch({
    type,
    err
  });
  if (err.status === 401) {
    dispatch(push('/'));
  }
}

export const GET_MEDIA_REQUEST = 'GET_MEDIA_REQUEST';
export const GET_MEDIA_SUCCESS = 'GET_MEDIA_SUCCESS';
export const GET_MEDIA_FAILURE = 'GET_MEDIA_FAILURE';

function getMediaRequest() {
  return {
    type: GET_MEDIA_REQUEST
  }
}

function getMediaSuccess(response) {
  return {
    type: GET_MEDIA_SUCCESS,
    response
  }
}

export function getMedia({ mediaId, filter }) {
  return (dispatch) => {
    dispatch(getMediaRequest());

    return api.media.getMedia(mediaId).then((res) => {
      // 1. Reconsture urls for livephoto
      // 2. Update dimension for the selected quality
      if (res.result.type === MEDIA_TYPE.LIVE_PHOTO) {
        const { count, quality, shardingKey } = res.result.content;
        // TODO: Get cdnUrl from res
        const cdnUrl = 'http://52.198.24.135:6559';
        // TODO: Dynamically choose quality
        const selectedQuality = quality[0];
        const imgUrls =
          range(0, count).map((idx) => `${cdnUrl}/${shardingKey}/media/${mediaId}/live/${selectedQuality}/${idx}.jpg`);
        const width = parseInt(selectedQuality.split('X')[0], 10);
        const height = parseInt(selectedQuality.split('X')[1], 10);

        return merge({}, res, {
          result: {
            imgUrls,
            dimension: {
              width,
              height
            }
          }
        });
      }

      return res;
    }).then((res) => {
      // Filter is an optional function for post-processing the response
      if (isFunction(filter)) {
        return filter(res);
      }

      return res;
    }).then((res) => {
      dispatch(getMediaSuccess(res));
    }).catch((err) => {
      handleError(dispatch, GET_MEDIA_FAILURE, err);
    });
  }
}


export const LOAD_USER_MEDIA_REQUEST = 'LOAD_USER_MEDIA_REQUEST';
export const LOAD_USER_MEDIA_SUCCESS = 'LOAD_USER_MEDIA_SUCCESS';
export const LOAD_USER_MEDIA_FAILURE = 'LOAD_USER_MEDIA_FAILURE';

export function loadUserMedia({ id, lastMediaId, params = {}, userSession = {} }) {
  return (dispatch) => {
    let queryId;
    if (id) {
      queryId = id;
    } else if (params.id) {
      queryId = params.id;
    } else if (userSession.userId) {
      queryId = userSession.userId;
    }

    if (!queryId) {
      return dispatch({
        type: LOAD_USER_MEDIA_FAILURE,
        error: 'No user id specified'
      });
    }

    dispatch({
      type: LOAD_USER_MEDIA_REQUEST
    });

    return api.media.getUserMedia(queryId, lastMediaId, userSession.accessToken).then((response) => {
      response.result.firstQuery = lastMediaId ? false : true;
      dispatch({
        type: LOAD_USER_MEDIA_SUCCESS,
        response
      });
    }).catch((err) => {
      handleError(dispatch, LOAD_USER_MEDIA_FAILURE, err);
    });
  };
}


export const CREATE_MEDIA_REQUEST = 'CREATE_MEDIA_REQUEST';
export const CREATE_MEDIA_SUCCESS = 'CREATE_MEDIA_SUCCESS';
export const CREATE_MEDIA_FAILURE = 'CREATE_MEDIA_FAILURE';

function createMediaRequest() {
  return {
    type: CREATE_MEDIA_REQUEST
  };
}

function createMediaSuccess(response) {
  return {
    type: CREATE_MEDIA_SUCCESS,
    response
  };
}

export function createMedia({ mediaType, title, caption, data, dimension, userSession = {} }) {
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

        return api.media.postMedia(mediaType, formData, userSession.accessToken);
      }).then((res) => {
        dispatch(createMediaSuccess(res));
        dispatch(push('/'));
        dispatch(pushNotification(NOTIFICATIONS.POST_MEDIA_SUCCESS));
      }).catch((err) => {
        handleError(dispatch, CREATE_MEDIA_FAILURE, err);
      });
    } else if (mediaType === MEDIA_TYPE.PANO_PHOTO) {
      // TODO: Handle panophoto
    } else {
      const err = new Error(`Meida type: ${mediaType} is not supported`);
      err.status = 400;
      handleError(dispatch, CREATE_MEDIA_FAILURE, err);
    }
  };
}


export const DELETE_MEDIA_REQUEST = 'DELETE_MEDIA_REQUEST';
export const DELETE_MEDIA_SUCCESS = 'DELETE_MEDIA_SUCCESS';
export const DELETE_MEDIA_FAILURE = 'DELETE_MEDIA_FAILURE';

export function deleteMedia({ mediaId, userSession = {} }) {
  return (dispatch) => {
    dispatch({
      type: DELETE_MEDIA_REQUEST
    });

    return api.media.deleteMedia(mediaId, userSession.accessToken).then((response) => {
      response.mediaId = mediaId;
      dispatch({
        type: DELETE_MEDIA_SUCCESS,
        response
      });

      dispatch(pushNotification(NOTIFICATIONS.DELETE_MEDIA_SUCCESS));
    }).catch((err) => {
      handleError(dispatch, DELETE_MEDIA_FAILURE, err);
    });
  };
}
