import merge from 'lodash/merge';

import { Promise } from 'lib/utils';

// Get picture of a Facebook page
function getPagePicture (pageId) {
  return new Promise((resolve, reject) => {
    if (window.FB) {
      window.FB.api(`${pageId}/picture`, (res) => {
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

        const pages = new Array(res.data.length);
        let count = 0;

        // Get page picture of each page and fill page information into array
        res.data.forEach((page, idx) => {
          getPagePicture(page.id).then((imgUrl) => {
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
