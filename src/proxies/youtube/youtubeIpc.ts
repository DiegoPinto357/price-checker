import type { VideoData } from './types';

const getVideoData = async (videoId: string) => {
  return { videoId } as VideoData;
};

export default {
  getVideoData,
};
