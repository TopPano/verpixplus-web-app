import Base from './Base';

export default class UsersAPI extends Base {
  getProfile(userId, authToken) {
    if (authToken) { this.apiClient.setAuthToken(authToken); }
    return this.apiClient.get({
      url: `users/${userId}/profile`,
      requireAuth: true
    });
  }

  postProfilePicture(userId, payload, authToken) {
    if (authToken) {
      this.apiClient.setAuthToken(authToken);
    }

    return this.apiClient.post({
      url: `users/${userId}/photo`,
      payload,
      requireAuth: true
    })
  }

  postPassword(userId, payload, authToken) {
    if (authToken) {
      this.apiClient.setAuthToken(authToken);
    }

    return this.apiClient.post({
      url: `users/${userId}/changePassword`,
      payload,
      requireAuth: true
    })
  }

  resetPassword(payload, authToken) {
    if (authToken) {
      this.apiClient.setAuthToken(authToken);
    }

    return this.apiClient.post({
      url: 'users/requestResetPassword',
      payload,
      requireAuth: true
    });
  }

  putProfile(userId, payload, authToken) {
    if (authToken) {
      this.apiClient.setAuthToken(authToken);
    }

    return this.apiClient.put({
      url: `users/${userId}`,
      payload,
      requireAuth: true
    });
  }
}
