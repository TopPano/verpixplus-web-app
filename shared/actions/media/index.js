import api from 'lib/api';
import isFunction from 'lodash/isFunction';
import merge from 'lodash/merge';
import range from 'lodash/range';
import { push } from 'react-router-redux';

import { MEDIA_TYPE } from 'constants/common';
import { NOTIFICATIONS } from 'constants/notifications';
import concatImages from './concatImages';
import { pushNotification } from '../notifications';
import {
  genRandomNum,
  genUUID
} from 'lib/utils';

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
      if (res.result && (res.result.type === MEDIA_TYPE.LIVE_PHOTO)) {
        const {
          cdnUrl,
          count,
          quality,
          shardingKey
        } = res.result.content;
        // TODO: Dynamically choose quality
        const selectedQuality = quality[0];
        const imgUrls =
          range(0, count).map((idx) => `${cdnUrl}${shardingKey}/media/${mediaId}/live/${selectedQuality}/${idx}.jpg`);
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
export const CREATE_MEDIA_PROGRESS = 'CREATE_MEDIA_PROGRESS';
export const CREATE_MEDIA_SUCCESS = 'CREATE_MEDIA_SUCCESS';
export const CREATE_MEDIA_FAILURE = 'CREATE_MEDIA_FAILURE';

function createMediaRequest(media) {
  return {
    type: CREATE_MEDIA_REQUEST,
    media
  };
}

function createMediaProgress(progressMediaId, progress) {
  return {
    type: CREATE_MEDIA_PROGRESS,
    progressMediaId,
    progress
  };
}

function createMediaSuccess(response) {
  return {
    type: CREATE_MEDIA_SUCCESS,
    response
  };
}

// Interval for asking creation status
const MEDIA_POLLING_INTERVAL = 300;
// maximun times for asking media creation status
const MEDIA_RETRY_MAX_TIMES = 500;

function pollingAskMediaStatus(dispatch, progressMediaId, mediaId, progress, retryTimes) {
  api.media.getMedia(mediaId).then((res) => {
    const { status } = res.result;

    switch (status) {
      case 'completed':
      {
        dispatch(createMediaProgress(progressMediaId, 1));
        setTimeout(() => {
          dispatch(createMediaSuccess(merge({}, res, { progressMediaId })));
          dispatch(pushNotification(NOTIFICATIONS.POST_MEDIA_SUCCESS));
        }, 500);
        return;
      }
      case 'pending':
        if (retryTimes < MEDIA_RETRY_MAX_TIMES) {
          const addedProgress = genRandomNum(0.005, 0.02);
          const newProgress =
            (progress + addedProgress) < 1 ? (progress + addedProgress) : progress;
          dispatch(createMediaProgress(progressMediaId, newProgress));
          setTimeout(() => {
            pollingAskMediaStatus(dispatch, progressMediaId, mediaId, newProgress, retryTimes + 1);
          }, MEDIA_POLLING_INTERVAL);
        } else {
          handleError(dispatch, CREATE_MEDIA_FAILURE, new Error('Timeout'));
        }
        return;
      case 'failed':
        handleError(dispatch, CREATE_MEDIA_FAILURE, new Error('Create media failed'));
        return;
      default:
        handleError(dispatch, CREATE_MEDIA_FAILURE, new Error(`Unknown media status: ${status}`));
        return;
    }
  }).catch((err) => {
    handleError(dispatch, CREATE_MEDIA_FAILURE, err);
  });
}

export function createMedia({ mediaType, title, caption, data, dimension, userSession = {} }) {
  return (dispatch) => {
    dispatch(push('/'));

    if (mediaType === MEDIA_TYPE.LIVE_PHOTO) {
      const progressMediaId = genUUID();
      const concatMaxProgress = genRandomNum(0.4, 0.5);
      let progress = 0;

      dispatch(createMediaRequest({
        progressMediaId
      }));

      // TODO: dynamically choose thumbnail index
      concatImages(data, (percent) => {
        progress = percent * concatMaxProgress;
        dispatch(createMediaProgress(progressMediaId, progress));
      }).then((concatImgs) => {
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
        progress = progress + genRandomNum(0.03, 0.05);
        dispatch(createMediaProgress(progressMediaId, progress));
        pollingAskMediaStatus(dispatch, progressMediaId, res.result.mediaId, progress, 0);
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

export const CREATE_VIDEO_REQUEST = 'CREATE_VIDEO_REQUEST';
export const CREATE_VIDEO_SUCCESS = 'CREATE_VIDEO_SUCCESS';
export const CREATE_VIDEO_FAILURE = 'CREATE_VIDEO_FAILURE';

function createVideoRequest() {
  return {
    type: CREATE_VIDEO_REQUEST
  };
}

function createVideoSuccess(response) {
  return {
    type: CREATE_VIDEO_SUCCESS,
    response
  };
}

// Interval for asking video creation status
const VIDEO_POLLING_INTERVAL = 500;
// maximun times for asking video creation status
const VIDEO_RETRY_MAX_TIMES = 60;

function pollingAskVideoStatus(dispatch, mediaId, retryTimes) {
  api.media.getVideo(mediaId).then((res) => {
    const { videoStatus } = res.result;

    switch (videoStatus) {
      case 'completed':
      {
        dispatch(createVideoSuccess({ mediaId }));
        return;
      }
      case 'pending':
        if (retryTimes < VIDEO_RETRY_MAX_TIMES) {
          setTimeout(() => {
            pollingAskVideoStatus(dispatch, mediaId, retryTimes + 1);
          }, VIDEO_POLLING_INTERVAL);
        } else {
          handleError(dispatch, CREATE_VIDEO_FAILURE, new Error('Timeout'));
        }
        return;
      case 'failed':
        handleError(dispatch, CREATE_VIDEO_FAILURE, new Error('Create video failed'));
        return;
      default:
        handleError(dispatch, CREATE_VIDEO_FAILURE, new Error(`Unknown video status: ${videoStatus}`));
        return;
    }
  }).catch((err) => {
    handleError(dispatch, CREATE_VIDEO_FAILURE, err);
  });
}

export function createVideo({ mediaId, userSession = {} }) {
  return (dispatch) => {
    dispatch(createVideoRequest());

    api.media.postVideo(mediaId, userSession.accessToken).then(() => {
      pollingAskVideoStatus(dispatch, mediaId, 0);
    }).catch((err) => {
      handleError(dispatch, CREATE_VIDEO_FAILURE, err);
    });
  };
}

export const UPDATE_MEDIA_REQUEST = 'UPDATE_MEDIA_REQUEST';
export const UPDATE_MEDIA_SUCCESS = 'UPDATE_MEDIA_SUCCESS';
export const UPDATE_MEDIA_FAILURE = 'UPDATE_MEDIA_FAILURE';

function updateMediaRequest() {
  return {
    type: UPDATE_MEDIA_REQUEST
  };
}

function updateMediaSuccess(response) {
  return {
    type: UPDATE_MEDIA_SUCCESS,
    response
  };
}

export function updateMedia({ mediaId, title, caption, userSession = {} }) {
  return (dispatch) => {
    dispatch(updateMediaRequest());

    const formData = new FormData();

    formData.append('title', title);
    formData.append('caption', caption);

    api.media.putMedia(mediaId, formData, userSession.accessToken).then((res) => {
      dispatch(updateMediaSuccess(res));
      dispatch(push('/'));
      dispatch(pushNotification(NOTIFICATIONS.UPDATE_MEDIA_SUCCESS));
    }).catch((err) => {
      handleError(dispatch, UPDATE_MEDIA_FAILURE, err);
    });
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
      dispatch(push('/'));
      dispatch(pushNotification(NOTIFICATIONS.DELETE_MEDIA_SUCCESS));
    }).catch((err) => {
      handleError(dispatch, DELETE_MEDIA_FAILURE, err);
    });
  };
}
