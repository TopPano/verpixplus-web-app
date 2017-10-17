import Base from './Base';
import { Schema, arrayOf } from 'normalizr';

import { MEDIA_TYPE } from 'constants/common';

export default class MediaAPI extends Base {
  getMedia(mediaId) {
    return this.apiClient.get({
      url: `media/${mediaId}`
    });
  }

  getUserMedia(userId, lastMediaId, authToken) {
    if (authToken) {
      this.apiClient.setAuthToken(authToken);
    }
    const payload = lastMediaId ? {
      where: {
        sid: {
          lt: lastMediaId
        }
      }
    } : {};
    return this.apiClient.post({
      url: `users/${userId}/profile/query`,
      payload,
      requireAuth: true,
      schema: { result: { feed: arrayOf(new Schema('media', { idAttribute: 'sid' })) } }
    });
  }

  getVideo(mediaId) {
    return this.apiClient.get({
      url: `media/${mediaId}/video`
    });
  }

  postMedia(mediaType, payload, authToken) {
    if (authToken) {
      this.apiClient.setAuthToken(authToken);
    }
    if (mediaType === MEDIA_TYPE.LIVE_PHOTO) {
      return this.apiClient.post({
        url: 'media/livephoto',
        payload,
        requireAuth: true,
        contentType: 'multipart/form-data'
      });
    } else if (mediaType === MEDIA_TYPE.PANO_PHOTO) {
      return this.apiClient.post({
        url: 'media/panophoto',
        payload,
        requireAuth: true,
        contentType: 'multipart/form-data'
      });
    } else {
      // TODO: Error handling for other cases
      return null;
    }
  }

  postVideo(mediaId, authToken) {
    if (authToken) {
      this.apiClient.setAuthToken(authToken);
    }
    return this.apiClient.post({
      url: `media/${mediaId}/video`,
      requireAuth: true
    });
  }

  putMedia(mediaId, media, authToken) {
    if (authToken) {
      this.apiClient.setAuthToken(authToken);
    }

    return this.apiClient.put({
      url: `media/${mediaId}`,
      payload: media,
      requireAuth: true,
      contentType: 'multipart/form-data'
    });
  }

  deleteMedia(mediaId, authToken) {
    if (authToken) {
      this.apiClient.setAuthToken(authToken);
    }
    return this.apiClient.delete({
      url: `media/${mediaId}`,
      requireAuth: true
    });
  }
}
