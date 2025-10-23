import axios from 'axios';
import { SERVER_HOST } from '../../config';

import type { VideoData } from './types';

const getVideoData = async (videoURL: string) => {
  try {
    const { data } = await axios.get<VideoData>(
      `${SERVER_HOST}/youtube/video-data`,
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
