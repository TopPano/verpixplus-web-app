import Base from './Base';

export default class UsersAPI extends Base {
  signIn(creds) {
    return this.apiClient.post({
      url: 'users/login?include=user',
      payload: creds
    });
  }

  signUp(creds) {
    return this.apiClient.post({
      url: 'users',
      payload: creds
    });
  }

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

  resetPassword(payload) {
    return this.apiClient.post({
      url: 'users/requestResetPassword',
      payload
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
