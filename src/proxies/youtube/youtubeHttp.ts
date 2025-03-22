import axios from 'axios';

import type { VideoData } from './types';

const serverHost = 'http://127.0.0.1:3002';

const getVideoData = async (videoURL: string) => {
  try {
    const { data } = await axios.get<VideoData>(
      `${serverHost}/youtube/video-data`,
      {
        params: {
          videoURL,
        },
      }
    );
    return data;
  } catch (error) {
    return;
  }
};

export default {
  getVideoData,
};
