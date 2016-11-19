import api from 'lib/api';

import { Promise } from 'lib/utils';

// Interval for asking video creation status
const VIDEO_POLLING_INTERVAL = 500;
// maximun times for asking video creation status
const VIDEO_RETRY_MAX_TIMES = 60;

export default function createVideo(mediaId, accessToken) {
  return new Promise((resolve, reject) => {
    api.media.postVideo(mediaId, accessToken).then(() => {
      const pollingAskVideoStatus = (retryTimes) => {
        api.media.getVideo(mediaId).then((res) => {
          const { videoStatus } = res.result;

          switch (videoStatus) {
            case 'completed':
            {
              const {
                cdnUrl,
                shardingKey,
                videoType
              } = res.result;
              const videoUrl = `${cdnUrl}${shardingKey}/media/${mediaId}/live/video.${videoType}`;
              resolve(videoUrl);
              return;
            }
            case 'pending':
              if (retryTimes < VIDEO_RETRY_MAX_TIMES) {
                setTimeout(() => {
                  pollingAskVideoStatus(retryTimes + 1);
                }, VIDEO_POLLING_INTERVAL);
              } else {
                reject(new Error('Timeout'));
              }
              return;
            case 'failed':
              reject(new Error('Create video failed'));
              return;
            default:
              reject(new Error(`Unknown video status: ${videoStatus}`));
              return;
          }
        }).catch((err) => {
          reject(err);
        });
      };

      pollingAskVideoStatus(0);
    }).catch((err) => {
      reject(err);
    });
  });
}
