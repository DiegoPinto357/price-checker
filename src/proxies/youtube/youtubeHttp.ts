import axios from 'axios';
import { getServerHost } from '../../config';

import type { VideoData } from './types';

const getVideoData = async (videoURL: string) => {
  try {
    const serverHost = await getServerHost();
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
