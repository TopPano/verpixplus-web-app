import api from 'lib/api';
import isFunction from 'lodash/isFunction';
import merge from 'lodash/merge';
import range from 'lodash/range';

import { MEDIA_TYPE } from 'constants/common';
import concatImages from './concatImages';

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

function getMediaFailure(err) {
  return {
    type: GET_MEDIA_FAILURE,
    err
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
      dispatch(getMediaFailure(err));
    });
  }
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
