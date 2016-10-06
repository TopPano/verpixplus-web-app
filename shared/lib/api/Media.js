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
      authenticated: true,
      schema: { result: { feed: arrayOf(new Schema('media', { idAttribute: 'sid' })) } }
    });
  }

  postMedia(mediaType, media, authToken) {
    if (authToken) {
      this.apiClient.setAuthToken(authToken);
    }
    if (mediaType === MEDIA_TYPE.LIVE_PHOTO) {
      return this.apiClient.post({
        url: 'media/livephoto',
        payload: media,
        authenticated: true,
        contentType: 'multipart/form-data'
      });
    } else if (mediaType === MEDIA_TYPE.PANO_PHOTO) {
      // TODO: Handle panophoto
    } else {
      // TODO: Error handling for other cases
      return null;
    }
  }

  deleteMedia(mediaId, authToken) {
    if (authToken) {
      this.apiClient.setAuthToken(authToken);
    }
    return this.apiClient.delete({
      url: `media/${mediaId}`,
      authenticated: true
    });
  }
}
