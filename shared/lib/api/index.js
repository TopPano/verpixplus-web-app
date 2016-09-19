import ApiClient from './ApiClient';
import UsersAPI from './Users';
import MediaAPI from './Media';

function apiFactory() {
  const api = new ApiClient();

  return {
    users: new UsersAPI({ apiClient: api }),
    media: new MediaAPI({ apiClient: api })
  };
}

export default apiFactory();
