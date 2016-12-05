import merge from 'lodash/merge';

import { Promise } from 'lib/utils';

// Get picture of a Facebook group or page
function getPicture (id) {
  return new Promise((resolve, reject) => {
    if (window.FB) {
      window.FB.api(`${id}/picture`, (res) => {
        if (!res) {
          reject(new Error('Empty response for getting managed pages'));
        }
        if (res.error) {
          reject(res.error);
        }
        resolve(res.data.url);
      });
    } else {
      reject(new Error('Facebook SDK is not loaded'));
    }
  });
}

export function getFacebookGroups (userId) {
  return new Promise((resolve, reject) => {
    if (window.FB) {
      window.FB.api(`${userId}/groups`, (res) => {
        if (!res) {
          reject(new Error('Empty response for getting groups'));
        }
        if (res.error) {
          reject(res.error);
        }

        if (res.data.length === 0) {
          resolve([]);
        }

        const groups = new Array(res.data.length);
        let count = 0;

        // Get page picture of each page and fill page information into array
        res.data.forEach((group, idx) => {
          getPicture(group.id).then((imgUrl) => {
            groups[idx] = merge({}, group, { imgUrl });
            count++;
            if (count === groups.length) {
              resolve(groups);
            }
          }).catch((err) => {
            reject(err);
          });
        });
      });
    } else {
      reject(new Error('Facebook SDK is not loaded'));
    }
  });
}

// Get list of Facebook pages managed by a user
export function  getFacebookManagedPages (userId) {
  return new Promise((resolve, reject) => {
    if (window.FB) {
      window.FB.api(`${userId}/accounts`, (res) => {
        if (!res) {
          reject(new Error('Empty response for getting managed pages'));
        }
        if (res.error) {
          reject(res.error);
        }

        if (res.data.length === 0) {
          resolve([]);
        }

        const pages = new Array(res.data.length);
        let count = 0;

        // Get page picture of each page and fill page information into array
        res.data.forEach((page, idx) => {
          getPicture(page.id).then((imgUrl) => {
            pages[idx] = merge({}, page, { imgUrl });
            count++;
            if (count === pages.length) {
              resolve(pages);
            }
          }).catch((err) => {
            reject(err);
          });
        });
      });
    } else {
      reject(new Error('Facebook SDK is not loaded'));
    }
  });
}
