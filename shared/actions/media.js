import api from 'lib/api';
import isFunction from 'lodash/isFunction';
import merge from 'lodash/merge';
import range from 'lodash/range';

import { MEDIA_TYPE } from 'constants/common';

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
