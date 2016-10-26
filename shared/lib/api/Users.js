import Base from './Base';

export default class UsersAPI extends Base {
  getProfile(id, authToken) {
    if (authToken) { this.apiClient.setAuthToken(authToken); }
    return this.apiClient.get({
      url: `users/${id}/profile`,
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
}
